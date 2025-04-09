import {IsString,IsEmail} from 'class-validator';
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
}