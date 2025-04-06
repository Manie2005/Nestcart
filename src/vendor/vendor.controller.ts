import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { LoginDto } from 'src/dto/login-vendor.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { ForgotPasswordDto } from 'src/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';

@Controller('vendor')
export class VendorController {
    constructor (private  readonly vendorService:VendorService){}

@Post('signup')
async signup(@Body() createVendorDto:CreateVendorDto){
    return this.vendorService.signup(createVendorDto);
}
@Post('login')
async login(@Body() loginDto:LoginDto){
    const {email,password }=loginDto;
    return this.vendorService.login(loginDto);
}
@Post('verify-otp')
async verifyOtp(@Body()verifyOtpDto:VerifyOtpDto){
const {email,otpCode} =verifyOtpDto;
try{
const isVerified = await this.vendorService.verifyOtp(verifyOtpDto);
if(isVerified){
    return{message:'User Successfully Verified'};
    }
    else{
        throw new BadRequestException('Invalid OTP');
    }
}catch(error){
return{
    message:'User not verified',error:error.message}
}}
@Post('forgot-password')
async forgotPassword(@Body() forgotPasswordDto:ForgotPasswordDto){
    await this.vendorService.forgotPassword(forgotPasswordDto.email);
}
@Post('reset-password')
async resetPassword(@Body() resetPasswordDto:ResetPasswordDto){
    await this.vendorService.resetPassword(
        resetPasswordDto.Token,
        resetPasswordDto.newPassword
    )
}
}
