import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { AuthSchema,Auth } from 'src/schema/auth.schema';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import {MailerService} from '@nestjs-modules/mailer';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { LoginDto } from 'src/dto/login-user.dto';
import { userInfo } from 'os';
@Injectable()
export class AuthService {
saveFileInfo(userId: string, file: Express.Multer.File) {
  throw new Error('Method not implemented.');
}
constructor(@InjectModel(Auth.name) private authModel: Model<Auth>,
private readonly jwtService:JwtService, 
private readonly mailerService:MailerService
){}
//Generate a random 5 digit Otpcode
private generateOtp():string{
    return Math.floor(10000 + Math.random() * 90000).toString();
}
//Use Mailerservice to send email
private async sendEmail(email:string,subject:string,text:string):Promise<void>{
const transporter = nodemailer.createTransport({
service:'gmail',//Whichever email service you want to use
auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS},
    secure:true,
    host:'smtp.gmail.com',
    port:465,
})
if (!email||!subject||!text){throw new BadRequestException('Email,Subject or Text field is missing')}

try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    throw new Error('Failed to send email. Please try again later.');
  }
}
//User Signup Method

async signup(createUserDto:CreateUserDto):Promise<any>
{
    const {firstname,lastname,phonenumber,password,email,address,role ='vendor'}=createUserDto;
    if(!password){
        throw new BadRequestException('Password field is required')
    }
//Confirm if the user is not an existing user
const existingUser= await this.authModel.findOne({email});
if(existingUser){
    throw new BadRequestException('User already exists')
}
//Generate an OTP and give it expiration time to validate userr
const otpCode= this.generateOtp();
const otpExpires = new Date(Date.now()+ 10 * 60 * 1000); //Expires In 10 Minutes
//Hash Userr Password
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 12;
const hashedPassword= await bcrypt.hash(password,saltRounds);

  //Create new User Document
const newUser=new this.authModel({
    firstname,lastname,phonenumber,password:hashedPassword,email,address,role,otpCode,otpExpires
});
//Save the user and send OTP 
try{
await newUser.save( )
await this.sendEmail(
    email,
    `NestCart OTP Code`,
    `Hello ${firstname}, your NestCart Code is: ${otpCode}.Please note that this otp is valid for only 10 minutes`,
);
return{message:`OtpCode has been sent successfully. Please verify within 10 minutes. Account created as ${role}`};
}catch(error){
    console.log(`Error saving :${error.message}`)
    throw new InternalServerErrorException('Error creating accounts. Please try again later.');

}
}
//Verify Otp From User
async verifyOtp(verifyOtpDto:VerifyOtpDto):Promise<any>
{
    const {email,otpCode}=verifyOtpDto;
    //Find user by email
    const user= await this.authModel.findOne({email});
    if(!user){
        throw new BadRequestException('Invalid Credential')
    }

//Ensure OtpCode is valid and is not expired and save
if(user.otpCode!= otpCode.toString()){
throw new BadRequestException('Invalid Otp')
}
if(new Date(user.otpExpires).getTime() < Date.now()){
throw new BadRequestException('Expired Otp')
}
user.otpCode=undefined;
user.otpExpires=undefined;
user.isVerified=true;
try{
    await user.save();
    return{message:'Your sccount has been verified successfully'};
}
catch(error){
    console.error(`Error saving the user: ${error.message}`);
}
}
//User Login Method
async login (loginDto:LoginDto):Promise<{access_token:string}>{
    const {email,password}=loginDto;

    const user= await this.authModel.findOne({email});
    if(!user){
throw new BadRequestException('Invalid Credentials') 
    }
    const passwordMatches= await bcrypt.compare(password, user.password);
    if(!passwordMatches){
        throw new BadRequestException('Invalid Credentials')
    }
//Generate and Return JwtToken
const access_token = await this.jwtService.signAsync({ userid: user._id });
return { access_token };

}
async forgotPassword(email:string):Promise<void>{
const user= await this.authModel.findOne({email})
if(!user){
    throw new BadRequestException('Email cannot be found')
}
//Generate a resetToken
const resetToken= this.jwtService.sign(
    {userId:user._id  },
    {expiresIn: '1h'},
);

user.resetPasswordToken=resetToken;
user.resetTokenExpires = new Date(Date.now()+ 3600000);//An Hour
await user.save();

const resetLink = `http://example.com/reset-password?token=${resetToken}`;
try{
    await this.sendEmail(
        email,
        'Reset Password Link:',
        `Hello! You have requested a password reset. Use the link provided below: ${resetLink}`,
    );
    console.log('Reset Password Link successfully sent');
}
catch(error){
    console.log(`Failed To send ResetPassword Link : ${error.message}`);
throw new InternalServerErrorException('Failed to send Reset Password Email');
}
}
//Reset Password Functionality
async resetPassword(token:string, newPassword:string):Promise<void>{
    try{
        const decoded =this.jwtService.verify(token);
        const user = await this.authModel.findOne({
            _id:decoded.userId,
            resetPasswordToken:token,
            resetTokenExpires:{$gt: new Date()}
        });
        if(!user){
            throw new BadRequestException('Invalid or Expired Token')
        }
    
    const hashedPassword =await bcrypt.hash(newPassword,12); 
    user.password=hashedPassword;
    user.resetPasswordToken=undefined;
user.resetTokenExpires=undefined;
await user.save();
console.log('Password successfully reset');

 } catch(error){
    throw new BadRequestException('Invalid or Expired Token')
 }
 //Logout Method

}


































}
