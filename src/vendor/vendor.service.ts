import { BadRequestException, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { Vendor } from 'src/schema/vendor.schema';

@Injectable()
export class VendorService {
constructor(@InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
private readonly jwtService:JwtService, 
){}
//Vendor Signup Method
async signup(createVendorDto:CreateVendorDto):Promise<any>
{
    const {firstname,lastname,phonenumber,password,email,address}=createVendorDto;
    if(!password){
        throw new BadRequestException('Password field is required')
    }
}


















}
