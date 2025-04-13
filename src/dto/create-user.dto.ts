import {IsString,IsEmail, IsOptional, IsEnum} from 'class-validator';
export class CreateUserDto{
@IsString()
firstname:string;
@IsString()
lastname:string;
@IsString()
phonenumber:number;
@IsString()
password:string;
@IsString()
email:string;
@IsString()
address:string;
@IsOptional()
@IsEnum(['vendor', 'customer', 'admin']) // Allowed roles
role?: string;
}