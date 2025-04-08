import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import {Document} from "mongoose";
@Schema({timestamps:true})
export class Auth{
    @Prop({unique:true})
    id:string

    @Prop({required:true})
    firstname:string

    @Prop({required:true})
    lastname:string
    
    @Prop({required:true})
    phonenumber:number
    @Prop({required:true})
    password:string
    @Prop()
    isVerified:boolean
    @Prop()
    isActive:boolean
    @Prop()
    email:string
    @Prop()
    createdAt:Date
    @Prop()
    updatedAt:Date
    @Prop({ default: 'vendor',unique:true })  // Ensure role is always set to vendor
    role: string;
    @Prop()
    otpCode:string
    @Prop()
    otpExpires:Date
    @Prop()
    resetPasswordToken:string;
    @Prop()
    resetTokenExpires:Date;
}
export const AuthSchema =SchemaFactory.createForClass(Auth);