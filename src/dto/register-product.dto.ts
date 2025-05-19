import { IsString } from "class-validator";

export class RegisterProductDto{
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsString()
    category:string;

    @IsString()
    price:string;

    @IsString()
    quantity:string;

    @IsString()
    imageUrl:string;

}