import { IsMongoId, IsOptional, IsString } from "class-validator";
//Query required to accept query parametere
//I used this because for product search by customers
export class ProductQueryDto{
@IsOptional()
@IsMongoId()
categoryId?:string;

@IsString()
search?:string;

@IsOptional()
page:number;

@IsOptional()
limit?:number

}