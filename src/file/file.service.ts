import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
    async readMyFile() {
        const data = await fs.promises.readFile("data.txt", "utf8");
        return { content: data };
    }

    async writeMyFile(content: string) {
        await fs.promises.writeFile("output.txt", content, "utf8");
        return { message: "File written successfully." };
    }
}
