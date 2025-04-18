import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';

@Schema()
export class Product extends Document {
  @Prop()
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendor: Types.ObjectId; // Many-to-one: Product belongs to one Vendor
}

export const ProductSchema = SchemaFactory.createForClass(Product);
