import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// @Catch(HttpException) means this filter runs for ANY thrown HttpException
// (ConflictException, UnauthorizedException, NotFoundException, etc.)
// It lets us control the exact JSON shape instead of using NestJS's default format.

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus();

        // exception.getResponse() can be a string or an object (e.g. validation errors)
        const exceptionResponse = exception.getResponse();

        let message: string;
        let data: unknown = null;

        if (typeof exceptionResponse === 'string') {
            // e.g. throw new HttpException('Something went wrong', 400)
            message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object') {
            const res = exceptionResponse as Record<string, unknown>;

            if (Array.isArray(res['message'])) {
                // Validation errors from ValidationPipe — message is string[]
                message = 'Please provide all the required fields';
                data = (res['message'] as string[]).map((err) => ({
                    field: err.split(' ')[0],
                    error: err,
                }));
            } else if (res['data'] !== undefined) {
                // Custom exceptions with explicit { message, data } shape
                // e.g. throw new ConflictException({ message: '...', data: [...] })
                message = res['message'] as string;
                data = res['data'];
            } else {
                // Plain string-message HttpExceptions
                message = res['message'] as string;
            }
        } else {
            message = 'An error occurred';
        }

        response.status(statusCode).json({
            success: false,
            message,
            data,
        });
    }
}
