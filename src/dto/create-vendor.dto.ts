import {IsString,IsEmail} from 'class-validator';
export class CreateVendorDto{
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
}