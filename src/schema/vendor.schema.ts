import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

@Schema()
export class Vendor extends Document {
  @Prop()
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[]; // One-to-many: Vendor has many Products
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
