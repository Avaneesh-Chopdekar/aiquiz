import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await compare(password, user.passwordHash);
    return ok ? user : null;
  }

  getTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const access = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS'
      ),
    });
    const refresh = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS'
      ),
    });
    return { access, refresh };
  }
}
