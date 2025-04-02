import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { Vendor } from 'src/schema/vendor.schema';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import {MailerService} from '@nestjs-modules/mailer';
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


















}
