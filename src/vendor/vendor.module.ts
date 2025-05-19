import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor, VendorSchema } from 'src/schema/vendor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
    JwtModule.register({
secret:jwtConstants.secret || 'candace' ,
signOptions:{expiresIn:'120s'},
    }),
  ],
  controllers: [VendorController],
  providers: [VendorService]
})
export class VendorModule {}
