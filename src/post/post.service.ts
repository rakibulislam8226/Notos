import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginate, PaginationOptions } from '../common/pagination/paginate';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreatePostDto, authorId: number, files: Express.Multer.File[], baseUrl: string) {
    const post = await this.prisma.posts.create({
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published,
        authorId,
        // If files were uploaded, create PostsMedia records inline
        media: files.length > 0 ? {
          create: files.map((file) => ({
            url: `${baseUrl}/media/${file.filename}`,
          })),
        } : undefined,
      },
      include: { media: true },
    });

    return post;
  }

  findAll(userId: number, options: PaginationOptions) {
    return paginate(
      this.prisma.posts,
      { where: { authorId: userId }, include: { media: true } },
      options,
    );
  }

  findOne(id: number, userId: number) {
    return this.prisma.posts.findUnique({
      where: { id, authorId: userId },
      include: { media: true },
    });
  }

  async update(id: number, userId: number, dto: UpdatePostDto, files: Express.Multer.File[], baseUrl: string) {
    // Ensure the post exists and belongs to the current user
    const existing = await this.prisma.posts.findUnique({
      where: { id, authorId: userId },
    });
    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    // Use a transaction so the delete and create are one atomic operation.
    // This guarantees the response always reflects exactly what was saved.
    return this.prisma.$transaction(async (tx) => {
      if (files.length > 0) {
        await tx.postsMedia.deleteMany({ where: { postId: id } });
      }

      return tx.posts.update({
        where: { id },
        data: {
          title: dto.title,
          content: dto.content,
          published: dto.published,
          media: files.length > 0 ? {
            create: files.map((file) => ({
              url: `${baseUrl}/media/${file.filename}`,
            })),
          } : undefined,
        },
        include: { media: true },
      });
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.posts.delete({
      where: { id, authorId: userId },
    });
  }
}
