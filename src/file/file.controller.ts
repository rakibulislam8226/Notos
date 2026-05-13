import { Controller, Get } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {

    constructor(private readonly fileService: FileService) { }

    @Get('read')
    readFile() {
        return this.fileService.readFile();
    }
    @Get('write')
    writeFile() {
        return this.fileService.writeFile();
    }
}