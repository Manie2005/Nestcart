import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorModule } from './vendor/vendor.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [ConfigModule.forRoot(), //Load my env file
   ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI) //GET MONGO_URI Value
      ,AuthModule, CustomerModule, VendorModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
