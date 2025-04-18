import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';//generates a secretkey
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFAService {
  generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `MyApp (${email})`, // name seen in Authenticator app
    });

    return {
      otpauth_url: secret.otpauth_url,//generate a url path using that secretkey
      base32: secret.base32,
    };
  }
//url path converted to a qrcode
  async generateQRCode(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl); // returns a data URL for display
  }

  verifyToken(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }
}
