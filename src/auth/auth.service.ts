import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    // Access token — valid for 1 day, used on every API request via Authorization header
    const access_token = this.jwtService.sign(payload);

    // Refresh token — long-lived (7 days), only used to get a new access token.
    // Uses a separate secret so a compromised JWT_SECRET cannot forge refresh tokens.
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async register(dto: RegisterDto) {
    // Check if the email is already taken
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Email already registered',
        data: [{ field: 'email', error: 'Email already registered' }],
      });
    }

    // bcrypt.hash auto-generates a salt — 10 rounds is the recommended default
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        first_name: dto.first_name,
        last_name: dto.last_name ?? null,
      },
    });

    // Never return the password hash — strip it before sending the response
    const { password: _omit, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, ...this.generateTokens(user.id, user.email) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Check both user existence and password in one condition.
    // Using the same error message for both prevents email enumeration attacks
    // (attacker cannot tell whether the email exists or the password is wrong).
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _omit, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, ...this.generateTokens(user.id, user.email) };
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: { sub: number; email: string };

    try {
      // Verify the refresh token using the refresh secret
      payload = this.jwtService.verify(dto.refresh_token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Issue a brand new access token (and a new refresh token — token rotation)
    return this.generateTokens(payload.sub, payload.email);
  }
}