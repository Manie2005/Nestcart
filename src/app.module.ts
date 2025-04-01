import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [VendorModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
