import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  phonenumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: 'vendor' }) // default role
  role: string;

  @Prop()
  otpCode?: string;

  @Prop()
  otpExpires?: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetTokenExpires?: Date;

  @Prop()
  profileImageUrl: string;

  @Prop()
  profileImageName: string;

  @Prop({ nullable: true })
  twoFactorSecret?: string;

  @Prop({ default: false })
  isTwoFactorEnabled?: boolean;

  //Had an issue here,decorating with Prop causes error when saving user.LOL
  _id?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// Extend document so typescript notes the extra fields mongo attached to the document
export type AuthDocument = Auth & Document;
