import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  writeFile() {
    fs.writeFileSync('output.txt', 'Hello Rakib from NestJS');

    return {
      success: true,
    };
  }

  readFile() {
    const data = fs.readFileSync('data.txt', 'utf8');

    return {
      content: data,
    };
  }
}
