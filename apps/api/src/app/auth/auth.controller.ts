import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const user = req.user as User;
    const { access, refresh } = this.authService.getTokens(user);
    res.cookie('access_token', access, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: parseInt(
        this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')
      ),
    });
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: parseInt(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')
      ),
    });
    return { ok: true };
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return await this.authService.getCurrentUser(req.user as User);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = req.cookies?.['refresh_token'];
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });
      const { access, refresh } = this.authService.getTokens(payload);
      res.cookie('access_token', access, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        maxAge: parseInt(
          this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')
        ),
      });
      res.cookie('refresh_token', refresh, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        maxAge: parseInt(
          this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')
        ),
      });
      return { ok: true };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { ok: true };
  }
}
