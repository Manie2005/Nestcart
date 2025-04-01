import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot(), //Load my env file
    MongooseModule.forRoot(process.env.MONGO_URI) //GET MONGO_URI Value
      ,VendorModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
