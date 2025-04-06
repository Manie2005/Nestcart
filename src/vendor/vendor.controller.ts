import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { LoginDto } from 'src/dto/login-vendor.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';

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

}

}

}
