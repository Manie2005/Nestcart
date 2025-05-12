import {IsString,IsEmail, IsOptional, IsEnum} from 'class-validator';
export class CreateUserDto{//
@IsString()
firstname:string;
@IsString()
lastname:string;
@IsString()
phonenumber:string;
@IsString()
password:string;
@IsString()
@IsEmail()
email:string;
@IsString()
address:string;
@IsOptional()
@IsEnum(['vendor', 'customer', 'admin']) // Allowed roles
role?: string;
}