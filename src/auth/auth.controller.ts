import { BadRequestException, Body, Controller, Get, Post,Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from 'src/dto/login-user.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { ForgotPasswordDto } from 'src/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}

@Post('signup')
async signup(@Body() createUserDto:CreateUserDto){
    return this.authService.signup(createUserDto);
}
@Post('login')
async login(@Body() loginDto:LoginDto){
    const {email,password }=loginDto;
    return this.authService.login(loginDto);
}
@Post('verify-otp')
async verifyOtp(@Body()verifyOtpDto:VerifyOtpDto){
const {email,otpCode} =verifyOtpDto;
try{
const isVerified = await this.authService.verifyOtp(verifyOtpDto);
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
    await this.authService.forgotPassword(forgotPasswordDto.email);
}
@Post('reset-password')
async resetPassword(@Body() resetPasswordDto:ResetPasswordDto){
    await this.authService.resetPassword(
        resetPasswordDto.Token,
        resetPasswordDto.newPassword
    )
}

@UseGuards(AuthGuard)
@Get('profile')
getProfile(@Request() req){
    return req.user
}
}
