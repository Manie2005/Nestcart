import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { CreateUserDto } from 'src/dto/create-user.dto';
  import { Auth } from 'src/schema/auth.schema';
  import * as bcrypt from 'bcrypt';
  import * as nodemailer from 'nodemailer';
  import { MailerService } from '@nestjs-modules/mailer';
  import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
  import { LoginDto } from 'src/dto/login-user.dto';
  import { Upload, UploadDocument } from 'src/schema/upload.schema';
  import { TwoFAService } from 'src/two-fa/two-fa.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectModel(Auth.name) private authModel: Model<Auth>,
      @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
      private readonly jwtService: JwtService,
      private readonly mailerService: MailerService,
      private readonly twoFAService: TwoFAService
    ) {}
  
    private generateOtp(): string {
      return Math.floor(10000 + Math.random() * 90000).toString();
    }
  
    private async sendEmail(email: string, subject: string, text: string): Promise<void> {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
      });
      
  
      if (!email || !subject || !text) {
        throw new BadRequestException('Email, Subject or Text field is missing');
      }
  
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject,
          text,
        });
      } catch (error) {
  console.error('Email send failed:', error);
  throw new InternalServerErrorException('Failed to send email.');
}

    }
  
    async signup(createUserDto: CreateUserDto): Promise<any> {
      const { firstname, lastname, phonenumber, password, email, address, role = 'vendor' } = createUserDto;
  
      if (!password) throw new BadRequestException('Password field is required');
  
      const existingUser = await this.authModel.findOne({ email });
      if (existingUser) throw new BadRequestException('User already exists');
  
      const otpCode = this.generateOtp();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new this.authModel({
        firstname,
        lastname,
        phonenumber,
        password: hashedPassword,
        email,
        address,
        role,
        otpCode,
        otpExpires,
      });
  
      try {
        await newUser.save();
        await this.sendEmail(
          email,
          `NestCart OTP Code`,
          `Hello ${firstname}, your NestCart Code is: ${otpCode}. Please verify within 10 minutes.`
        );
        return { message: `OtpCode has been sent successfully. Account created as ${role}` };
      } catch (error) {
        console.error('Error while creating user:', error);
        throw new InternalServerErrorException('Error creating account. Try again later.');
      }
      
    }
  
    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
      //
      const { email, otpCode } = verifyOtpDto;
      const user = await this.authModel.findOne({ email });
  
      if (!user || user.otpCode !== otpCode.toString() || new Date(user.otpExpires).getTime() < Date.now()) {
        throw new BadRequestException('Invalid or expired OTP');
      }
  
      user.otpCode = undefined;
      user.otpExpires = undefined;
      user.isVerified = true;
      await user.save();
  
      return { message: 'Your account has been verified successfully' };
    }
  
    async login(loginDto: LoginDto): Promise<any> {
      const { email, password } = loginDto;
      const user = await this.authModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid credentials');
      }
  
      if (user.isTwoFactorEnabled) {
        return {
          requiresTwoFactor: true,
          tempUserId: user.id,
        };
      }
  
      const access_token = await this.jwtService.signAsync({ userid: user._id });
      return { access_token };
    }
  
    async complete2FALogin(userId: string, code: string): Promise<{ access_token: string }> {
      const user = await this.authModel.findById(userId);
      if (!user || !user.twoFactorSecret || !this.twoFAService.verifyToken(code, user.twoFactorSecret)) {
        throw new BadRequestException('Invalid 2FA code');
      }
  
      const access_token = await this.jwtService.signAsync({ userid: user._id });
      return { access_token };
    }
  // Find a user by their ID
async findById(userId: string): Promise<Auth> {
  const user = await this.authModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

// Update a user's record with new fields (like 2FA secret or enabling 2FA)
async updateUser(userId: string, updates: Partial<Auth>): Promise<Auth> {
  const updatedUser = await this.authModel.findByIdAndUpdate(userId, updates, { new: true });
  if (!updatedUser) {
    throw new NotFoundException('User not found for update');
  }
  return updatedUser;
}


    async enable2FA(userId: string): Promise<{ qrCode: string }> {
      const user = await this.authModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');
  
      const { otpauth_url, base32 } = this.twoFAService.generateSecret(user.email);
      user.twoFactorSecret = base32;
      await user.save();
  
      const qrCode = await this.twoFAService.generateQRCode(otpauth_url);
      return { qrCode };
    }
  
    async verify2FA(userId: string, code: string): Promise<{ message: string }> {
      const user = await this.authModel.findById(userId);
      if (!user || !user.twoFactorSecret || !this.twoFAService.verifyToken(code, user.twoFactorSecret)) {
        throw new BadRequestException('Invalid 2FA code');
      }
      user.isTwoFactorEnabled = true;
      await user.save();
      return { message: '2FA successfully enabled' };
    }
  
    async logout(userId: string) {
      const user = await this.authModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');
  
      user.resetPasswordToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
  
      return { message: 'Logout successful. Reset token cleared.' };
    }
  
    async forgotPassword(email: string): Promise<void> {
      const user = await this.authModel.findOne({ email });
      if (!user) throw new BadRequestException('Email not found');
  
      const resetToken = this.jwtService.sign({ userId: user._id }, { expiresIn: '1h' });
      user.resetPasswordToken = resetToken;
      user.resetTokenExpires = new Date(Date.now() + 3600000);
      await user.save();
  
      const resetLink = `http://example.com/reset-password?token=${resetToken}`;
      await this.sendEmail(email, 'Reset Password Link', `Use this link to reset your password: ${resetLink}`);
    }
  
    async resetPassword(token: string, newPassword: string): Promise<void> {
      const decoded = this.jwtService.verify(token);
      const user = await this.authModel.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetTokenExpires: { $gt: new Date() },
      });
      if (!user) throw new BadRequestException('Invalid or expired token');
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
    }
  
    async saveFileInfo(userId: string, file: Express.Multer.File): Promise<Upload> {
      const createdFile = new this.uploadModel({
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
      });
      return createdFile.save();
    }
  }
  