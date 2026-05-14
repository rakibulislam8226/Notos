import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Apply @UseGuards(JwtAuthGuard) to any route that requires authentication.
// Automatically returns 401 if the token is missing, invalid, or expired.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            // Translate technical JWT errors into human-readable messages
            const reason = info?.message;
            let message = 'Unauthorized';

            if (reason === 'jwt expired') {
                message = 'Your session has expired. Please log in again.';
            } else if (reason === 'No auth token') {
                message = 'Authentication required. Please log in.';
            } else if (reason === 'invalid signature' || reason === 'invalid token') {
                message = 'Invalid token. Please log in again.';
            }

            throw err || new UnauthorizedException(message);
        }
        return user;
    }
}
