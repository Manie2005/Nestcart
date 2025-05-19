import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterCategoryDto } from 'src/dto/register-category.dto';
import { Category } from 'src/schema/category.schema';

@Injectable()
export class CategoryService {
constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    ){}
async register (registerCategoryDto: RegisterCategoryDto):Promise<any>{
    const{name}=registerCategoryDto;
    const existingCategory = await this.categoryModel.findOne({name}).exec();
    if(existingCategory) throw new BadRequestException('Category already exists');
    const  newCategory = new this.categoryModel({
        name
    });
    try{
await newCategory.save();
    }catch(error){
console.error('Error creating Category:', error);
throw new InternalServerErrorException('Error creating category');
    }
}
//Find Category by designated id
    async findOne(id:string): Promise<Category>{
const category = await this.categoryModel.findById(id).exec();
if(!category){
    throw new NotFoundException(`Category with${id} not found`);
}
return category;
    }




}
