import { IsString } from "class-validator";

export class RegisterCategoryDto{
@IsString()
name:string;

@IsString()
description:string;
}