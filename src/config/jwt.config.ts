import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// JWT module factory — used in AuthModule.
// Access token is short-lived (15 min). Refresh token uses a separate secret (see auth.service.ts).
export const jwtConfig = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '15m' },
});
