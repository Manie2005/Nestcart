// two-fa.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TwoFAService } from './two-fa.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('2fa')
export class TwoFAController {
  constructor(
    private readonly twoFAService: TwoFAService,
    private readonly authService: AuthService,
  ) {}

  // STEP 1: Generate QR code for the user
  @UseGuards(AuthGuard)
  @Post('generate')
  async generate(@Req() req) {
    const user = req.user;

    // Generate a 2FA secret and QR code for the user
    const { otpauth_url, base32 } = this.twoFAService.generateSecret(user.email);
    const qrCode = await this.twoFAService.generateQRCode(otpauth_url);

    // Save the secret temporarily to user's profile
    await this.authService.updateUser(user._id, {
      twoFactorSecret: base32,
    });

    return { qrCode };
  }

  // STEP 2: Verify the code entered by user
  @UseGuards(AuthGuard)
  @Post('verify')
  async verify(@Req() req, @Body('code') code: string) {
    const user = await this.authService.findById(req.user._id);

    const isValid = this.twoFAService.verifyToken(code, user.twoFactorSecret);

    if (isValid) {
      await this.authService.updateUser(user._id, {
        isTwoFactorEnabled: true,
      });
    }

    return { isValid };
  }
}
