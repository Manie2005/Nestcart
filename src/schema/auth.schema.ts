import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
@Schema({timestamps:true})
export class Auth{
    @Prop({required: false, unique: false })
    customId: string

    @Prop({required:true})
    firstname:string

    @Prop({required:true})
    lastname:string
    
    @Prop({required:true})
    phonenumber:string
    @Prop({required:true})
    password:string
    @Prop({default:false})
    isVerified:boolean
    @Prop({default:true})
    isActive:boolean
    @Prop({unique:true})
    email:string
        @Prop({ default: 'vendor'})  // Ensure role is always set to vendor
    role: string;
    @Prop()
    otpCode?:string
    @Prop()
    otpExpires?:Date
    @Prop()
    resetPasswordToken:string;
    @Prop()
    resetTokenExpires?:Date;
}
export const AuthSchema =SchemaFactory.createForClass(Auth);