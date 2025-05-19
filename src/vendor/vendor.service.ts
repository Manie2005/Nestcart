import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterProductDto } from 'src/dto/register-product.dto';
import { Auth } from 'src/schema/auth.schema';
import { Vendor } from 'src/schema/vendor.schema';
@Injectable()
export class VendorService {
    constructor(
      @InjectModel(Vendor.name) private vendorModel: Model<Auth>,
    private readonly jwtService:JwtService
    ){}
    //Register Vendor Product
async register(registerProductsDto:RegisterProductDto):Promise<any>{
    const {title, description,category,price,quantity,imageUrl}=registerProductsDto;
if(!title) throw new BadRequestException(`Product title is required`);
const existingProduct = await this.vendorModel.findOne({title});
if (existingProduct) throw new BadRequestException(`Product with this title already exists`);

const newProduct=new this.vendorModel({
title,
description,
category,
price,
quantity,  
imageUrl
});
try{
 await newProduct.save();
}catch(error){
   console.error('Error registering product:', error);
   throw new InternalServerErrorException('Error registering Product');
}
}
 //Register Category 
 




}
