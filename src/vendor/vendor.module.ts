import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor, VendorSchema } from 'src/schema/vendor.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])
  ],
  controllers: [VendorController],
  providers: [VendorService]
})
export class VendorModule {}
