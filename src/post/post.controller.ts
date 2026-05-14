import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, UseGuards, Req, UseInterceptors, UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { multerConfig } from '../config/multer.config';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @ResponseMessage('Post created successfully')
  // FilesInterceptor('media[]', 10) means: accept up to 10 files under the field name 'media[]'
  @UseInterceptors(FilesInterceptor('media[]', 10, multerConfig))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const userId = (req.user as { userId: number }).userId;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.postService.create(createPostDto, userId, files ?? [], baseUrl);
  }

  @Get()
  @ResponseMessage('Posts retrieved successfully')
  findAll(@Req() req: Request) {
    const userId = (req.user as { userId: number }).userId;
    return this.postService.findAll(userId);
  }

  @Get(':id')
  @ResponseMessage('Post retrieved successfully')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as { userId: number }).userId;
    return this.postService.findOne(+id, userId);
  }

  @Patch(':id')
  @ResponseMessage('Post updated successfully')
  @UseInterceptors(FilesInterceptor('media[]', 10, multerConfig))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const userId = (req.user as { userId: number }).userId;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.postService.update(+id, userId, updatePostDto, files ?? [], baseUrl);
  }

  @Delete(':id')
  @ResponseMessage('Post deleted successfully')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as { userId: number }).userId;
    return this.postService.remove(+id, userId);
  }
}
