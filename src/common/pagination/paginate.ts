export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    from: number;
    to: number;
    total: number;
    num_pages: number;
    current_page: number;
    has_previous: boolean;
    has_next: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

// Generic paginate helper that works with any Prisma model delegate.
// Usage:
//   return paginate(this.prisma.posts, { where: { authorId }, include: { media: true } }, { page, limit });
export async function paginate<T>(
    model: {
        findMany(args?: object): Promise<T[]>;
        count(args?: object): Promise<number>;
    },
    args: { where?: object; include?: object; orderBy?: object } = {},
    options: PaginationOptions,
): Promise<PaginatedResult<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        model.findMany({ ...args, skip, take: limit }),
        model.count({ where: args.where }),
    ]);

    const numPages = Math.ceil(total / limit);
    const from = total === 0 ? 0 : skip + 1;
    const to = Math.min(page * limit, total);

    return {
        data,
        meta: {
            from,
            to,
            total,
            num_pages: numPages,
            current_page: page,
            has_previous: page > 1,
            has_next: page < numPages,
        },
    };
}
