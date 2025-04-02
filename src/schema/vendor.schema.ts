import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import { UUID } from "mongodb";
import {Document} from "mongoose";
@Schema()
export class Vendor extends Document{
    @Prop({required:true,unique:true})//Give each vendor their unique id
    id:UUID
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
    createdAt:Date
    @Prop({required:true})
    updatedAt:boolean
    @Prop({ default: 'vendor' })  // Ensure role is always set to vendor
    role: string;
}
export const VendorSchema =SchemaFactory.createForClass(Vendor);