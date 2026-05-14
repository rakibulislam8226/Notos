import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    // Access token — short-lived (15 min), used for every API request
    const access_token = this.jwtService.sign(payload);

    // Refresh token — long-lived (7 days), used ONLY to get a new access token
    // It uses a DIFFERENT secret so even if the access token secret leaks,
    // the refresh token cannot be forged.
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async register(dto: RegisterDto) {
    // 1. Check if email is already taken
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the password — bcrypt generates a random salt automatically
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Save the user in the database (no tokens stored — they're stateless)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        first_name: dto.first_name,
        last_name: dto.last_name,
      },
    });

    // 4. Generate tokens and return with user (without password)
    const { password: _omit, ...userWithoutPassword } = user;
    const tokens = this.generateTokens(user.id, user.email);

    return { ...userWithoutPassword, ...tokens };
  }

  async login(dto: LoginDto) {
    // 1. Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }

    // 2. Compare the password with bcrypt
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new ConflictException('Invalid credentials');
    }

    // 3. Generate tokens and return with user (without password)
    const { password: _omit, ...userWithoutPassword } = user;
    const tokens = this.generateTokens(user.id, user.email);

    return { ...userWithoutPassword, ...tokens };
  }
}