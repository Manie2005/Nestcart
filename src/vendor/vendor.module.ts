import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorSchema } from 'src/schema/vendor.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
@Module({
  imports:[MongooseModule.forFeature([{name:'Vendor',schema:VendorSchema}]),
  JwtModule.register({
    secret:process.env.JWT_SECRET_KEY ||'candace',
    signOptions:{expiresIn:'1h'},
  }),
  MailerModule.forRoot({
    transport:{
      service:'smtp.gmail.com',
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      }
    }
  })
],
  providers: [VendorService],
  controllers: [VendorController],
  exports:[VendorService]
})
export class VendorModule {}
