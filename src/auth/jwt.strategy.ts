import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            // Extract the token from the "Authorization: Bearer <token>" header
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET') as string,
        });
    }

    // Called automatically after Passport verifies the token signature.
    // Whatever is returned here gets attached to req.user on the request object.
    validate(payload: { sub: number; email: string }) {
        return { userId: payload.sub, email: payload.email };
    }
}
