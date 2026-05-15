import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { PaginationOptions } from '../pagination/paginate';

// @Paginate() decorator — extracts and normalises ?page and ?limit query params.
// Defaults: page=1, limit=15. Max limit=100.
// Usage in a controller:
//   findAll(@Paginate() pagination: PaginationOptions) { ... }
export const Paginate = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): PaginationOptions => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const query = request.query as Record<string, string>;

        const page = Math.max(1, parseInt(query['page'], 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query['limit'], 10) || 15));

        return { page, limit };
    },
);
