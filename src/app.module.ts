import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorModule } from './vendor/vendor.module';
import { ScheduleModule } from '@nestjs/schedule';
import {GraphQLModule} from '@nestjs/graphql';
import {join} from 'path';
import { ApolloDriver,ApolloDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [ConfigModule.forRoot(), //Load my env file
   ScheduleModule.forRoot(),
   GraphQLModule.forRoot<ApolloDriverConfig>({
driver: ApolloDriver,
autoSchemaFile:join(process.cwd(),'src/schema.gql'), //Generate schema file
playground:true, //Enable GraphQL playground
   }),
    MongooseModule.forRoot(process.env.MONGO_URI) //GET MONGO_URI Value
      ,AuthModule, CustomerModule, VendorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
