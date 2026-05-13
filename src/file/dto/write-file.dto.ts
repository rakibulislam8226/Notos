import { ApiProperty } from '@nestjs/swagger';

export class WriteFileDto {
    @ApiProperty({ example: 'Hello from Swagger test!' })
    content!: string;
}
