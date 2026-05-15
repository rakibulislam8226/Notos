import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Paginate } from '../common/decorators/paginate.decorator';
import type { PaginationOptions } from '../common/pagination/paginate';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  @ResponseMessage('Todo created successfully')
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ResponseMessage('Todos retrieved successfully')
  findAll(@Paginate() pagination: PaginationOptions) {
    return this.todoService.findAll(pagination);
  }

  @Get(':id')
  @ResponseMessage('Todo retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Todo updated successfully')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  @ResponseMessage('Todo deleted successfully')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
