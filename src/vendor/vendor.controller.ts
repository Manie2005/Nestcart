import { Body, Controller, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { LoginDto } from 'src/dto/login-vendor.dto';

@Controller('vendor')
export class VendorController {
    constructor (private  readonly vendorService:VendorService){}

@Post('signup')
async signup(@Body() createVendorDto:CreateVendorDto){
    return this.vendorService.signup(createVendorDto);
}
@Post('login')
async login(@Body() loginDto:LoginDto){
    const{ email,password }=loginDto;
    return this.vendorService.login(loginDto);
}


}
