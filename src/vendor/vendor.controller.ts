import { Body, Controller, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';

@Controller('vendor')
export class VendorController {
    constructor (private  readonly vendorService:VendorService){}
@Post('signup')
async signup(@Body() createVendorDto:CreateVendorDto){
    return this.vendorService.signup(createVendorDto);
}

}
