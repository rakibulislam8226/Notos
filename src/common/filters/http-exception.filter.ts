import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

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

            // Validation errors from ValidationPipe produce { message: string[] }
            // All other HttpExceptions produce { message: string }
            message = Array.isArray(res['message'])
                ? (res['message'] as string[]).join(', ')
                : (res['message'] as string);

            // Preserve any extra fields in data (e.g. custom error details)
            const { message: _m, error: _e, statusCode: _s, ...rest } = res;
            if (Object.keys(rest).length > 0) {
                data = rest;
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
