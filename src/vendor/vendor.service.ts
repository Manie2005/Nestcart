import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { Vendor } from 'src/schema/vendor.schema';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import {MailerService} from '@nestjs-modules/mailer';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { LoginDto } from 'src/dto/login-vendor.dto';
import { userInfo } from 'os';
@Injectable()
export class VendorService {
constructor(@InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
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
//Vendor Signup Method
async signup(createVendorDto:CreateVendorDto):Promise<any>
{
    const {firstname,lastname,phonenumber,password,email,address}=createVendorDto;
    if(!password){
        throw new BadRequestException('Password field is required')
    }
//Confirm if the vendor is not an existing user
const existingVendor= await this.vendorModel.findOne({email});
if(existingVendor){
    throw new BadRequestException('Vendor already exists')
}
//Generate an OTP and give it expiration time to validate vendor
const otpCode= this.generateOtp();
const otpExpires = new Date(Date.now()+ 10 * 60 * 1000); //Expires In 10 Minutes
//Hash Vendor Password
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 12;
const hashedPassword= await bcrypt.hash(password,saltRounds);

//Create new Vendor Document
const newVendor=new this.vendorModel({
    firstname,lastname,phonenumber,password:hashedPassword,email,address,otpCode,otpExpires
});
//Save the vendor and send OTP 
try{
await newVendor.save()
await this.sendEmail(
    email,
    `NestCart OTP Code`,
    `Hello ${firstname}, your NestCart Code is: ${otpCode}.Please note that this otp is valid for only 10 minutes`,
);
return{message:'OtpCode has been sent successfully. Please verify within 10 minutes'};
}catch(error){
    throw new InternalServerErrorException('Error creating account. Please try again later.');

}
}
//Verify Otp From Vendor
async verifyOtp(verifyOtpDto:VerifyOtpDto):Promise<any>
{
    const {email,otpCode}=verifyOtpDto;
    //Find vendor by email
    const vendor= await this.vendorModel.findOne({email});
    if(!vendor){
        throw new BadRequestException('Invalid Credential')
    }

//Ensure OtpCode is valid and is not expired and save
if(vendor.otpCode!= otpCode.toString()){
throw new BadRequestException('Invalid Otp')
}
if(new Date(vendor.otpExpires).getTime() < Date.now()){
throw new BadRequestException('Expired Otp')
}
vendor.otpCode=undefined;
vendor.otpExpires=undefined;
vendor.isVerified=true;
try{
    await vendor.save();
    return{message:'Your sccount has been verified successfully'};
}
catch(error){
    console.error(`Error saving the user: ${error.message}`);
}
}
//Vendor Login Method
async login (loginDto:LoginDto):Promise<any>{
    const {email,password}=loginDto;

    const vendor= await this.vendorModel.findOne({email});
    if(!vendor){
throw new BadRequestException('Invalid Credentials') 
    }
    const passwordMatches= await bcrypt.compare(password, vendor.password);
    if(!passwordMatches){
        throw new BadRequestException('Invalid Credentials')
    }
//Generate and Return JwtToken
const token = this.jwtService.sign({vendorid: vendor._id});
return{accessToken:token};
}
async forgotPassword(email:string):Promise<void>{
const vendor= await this.vendorModel.findOne({email})
if(!email){
    throw new BadRequestException('Email cannot be found')
}
//Generate a resetToken
const resetToken= this.jwtService.sign(
    {vendorid:vendor._id  },
    {expiresIn: '1h'},
);

vendor.resetPasswordToken=resetToken;
vendor.resetTokenExpires = new Date(Date.now()+ 3600000);//An Hour
await vendor.save();

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
        const vendor = await this.vendorModel.findOne({
            _id:decoded.userId,
            resetPasswordToken:token,
            resetTokenExpires:{$gt: new Date()}
        });
        if(!vendor){
            throw new BadRequestException('Invalid or Expired Token')
        }
    
    const hashedPassword =await bcrypt.hash(newPassword,12); 
    vendor.password=hashedPassword;
    vendor.resetPasswordToken=undefined;
vendor.resetTokenExpires=undefined;
await vendor.save();
console.log('Password successfully reset');

 } catch(error){
    throw new BadRequestException('Invalid or Expired Token')
 }
}


































}
