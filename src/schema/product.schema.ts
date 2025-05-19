import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';

@Schema()
export class Product extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: string;

  @Prop()
  quantity: string;

  @Prop()
  imageUrl: string;

@Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId | Category; // Many Products to One category

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendor: Types.ObjectId; // Many Product belongs to one Vendor
}

export const ProductSchema = SchemaFactory.createForClass(Product);
