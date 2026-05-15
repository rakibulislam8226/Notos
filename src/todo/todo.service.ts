import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginationOptions } from '../common/pagination/paginate';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) { }

  create(data: any) {
    return this.prisma.todo.create({
      data,
    });
  }

  findAll(options: PaginationOptions) {
    return paginate(
      this.prisma.todo,
      {},
      options,
    );
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }


}