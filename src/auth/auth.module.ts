import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { jwtConstants } from './constants';
import { UploadModule } from 'src/upload/upload.module';
import { TwoFAService } from 'src/two-fa/two-fa.service';
@Module({
  imports:[MongooseModule.forFeature([{name:'Auth',schema:AuthSchema}]),
  UploadModule,
  JwtModule.register({
    secret:jwtConstants.secret||'candace', 
    signOptions:{expiresIn:'120s'},
  }),
  MailerModule,    
],
  providers: [AuthService,Auth,TwoFAService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
