import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterProductDto } from 'src/dto/register-product.dto';
import { Auth } from 'src/schema/auth.schema';
import { Vendor } from 'src/schema/vendor.schema';
import { CategoryService } from 'src/category/category.service';
import { Product } from 'src/schema/product.schema';
@Injectable()
export class VendorService {
    constructor(
       @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,

    private readonly jwtService:JwtService,
    private readonly categoryService:CategoryService
    ){}
    //Register Vendor Product
async register(registerProductsDto:RegisterProductDto):Promise<any>{
    const {title, description,price,quantity,imageUrl,categoryId}=registerProductsDto;

    // Verify category exists
    const category = await this.categoryService.findOne(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
if(!title) throw new BadRequestException(`Product title is required`);
const existingProduct = await this.vendorModel.findOne({title});
if (existingProduct) throw new BadRequestException(`Product with this title already exists`);

const newProduct=new this.vendorModel({
title,
description,
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
 
 




}
