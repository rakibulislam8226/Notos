import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

// This interceptor runs after every controller method.
// It wraps whatever the service returns into a consistent shape:
// { success: true, message: "...", data: { ... } }

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        // Read the @ResponseMessage() value set on the route handler (if any)
        const message =
            this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ??
            'Success';

        return next.handle().pipe(
            map((data) => ({
                success: true,
                message,
                data,
            })),
        );
    }
}
