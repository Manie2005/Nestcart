import { BadRequestException, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVendorDto } from 'src/dto/create-vendor.dto';
import { Vendor } from 'src/schema/vendor.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class VendorService {
constructor(@InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
private readonly jwtService:JwtService, 
){}
//Generate a random 5 digit Otpcode
private generateOtp():string{
    return Math.floor(10000 + Math.random() * 90000).toString();
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
    firstname,lastname,phonenumber,password,email,address
}) 







































}


















}
