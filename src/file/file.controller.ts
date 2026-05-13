import { Controller, Get, Post, Body } from '@nestjs/common';
import { FileService } from './file.service';
import { WriteFileDto } from './dto/write-file.dto';

@Controller('file')
export class FileController {

    constructor(private readonly fileService: FileService) { }

    @Get('read')
    readFile() {
        return this.fileService.readMyFile();
    }

    @Post('write')
    writeFile(@Body() body: WriteFileDto) {
        return this.fileService.writeMyFile(body.content);
    }
    @Get('users')
    getUsers() {
        return this.fileService.getUsers();
    }
}