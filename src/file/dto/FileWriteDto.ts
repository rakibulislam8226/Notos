import { IsString } from 'class-validator';

// DTO for writing a file as validation of query parameters

export class FileWriteDto {
    @IsString()
    name?: string;
}