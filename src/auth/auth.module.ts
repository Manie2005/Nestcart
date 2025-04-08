import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
@Module({
  imports:[MongooseModule.forFeature([{name:'Auth',schema:AuthSchema}]),
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
  providers: [AuthService,Auth],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
