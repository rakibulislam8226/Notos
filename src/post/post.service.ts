import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }

  create(data: any) {
    return this.prisma.posts.create({
      data,
    });
  }

  findAll(userId: number) {
    return this.prisma.posts.findMany({
      where: { authorId: userId },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.posts.findUnique({
      where: { id, authorId: userId },
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.posts.delete({
      where: { id, authorId: userId },
    });
  }

  update(id: number, data: any) {
    return this.prisma.posts.update({
      where: { id },
      data,
    });
  }
}
