import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorSchema } from 'src/schema/vendor.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:'Vendor',schema:VendorSchema}])],
  providers: [VendorService],
  controllers: [VendorController],
  exports:[VendorService]
})
export class VendorModule {}
