import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { Upload, UploadSchema } from 'src/schema/upload.schema';
@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Upload', schema: UploadSchema }])
    ],
    exports: [MongooseModule], // so it can be used in other modules
  })
  export class UploadModule {}
  