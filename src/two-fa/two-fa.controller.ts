import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TwoFAService } from './two-fa.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Auth } from 'src/schema/auth.schema'; // 👈 import the correct Mongoose type

interface AuthenticatedRequest extends Request {
  user: Auth;
}

@Controller('2fa')
export class TwoFAController {
  constructor(
    private readonly twoFAService: TwoFAService,
    private readonly authService: AuthService,
  ) {}

  // STEP 1: Generate QR code for the user
  @UseGuards(AuthGuard)
  @Post('generate')
  async generate(@Req() req: AuthenticatedRequest) {
    const user = req.user;

    const { otpauth_url, base32 } = this.twoFAService.generateSecret(user.email);
    const qrCode = await this.twoFAService.generateQRCode(otpauth_url);

    await this.authService.updateUser(user._id.toString(), {
      twoFactorSecret: base32,
    });

    return { qrCode };
  }

  // STEP 2: Verify the code entered by user
  @UseGuards(AuthGuard)
  @Post('verify')
  async verify(@Req() req: AuthenticatedRequest, @Body('code') code: string) {
    const user = await this.authService.findById(req.user._id.toString());

    const isValid = this.twoFAService.verifyToken(code, user.twoFactorSecret);

    if (isValid) {
      await this.authService.updateUser(user._id.toString(), {
        isTwoFactorEnabled: true,
      });
    }

    return { isValid };
  }
}
