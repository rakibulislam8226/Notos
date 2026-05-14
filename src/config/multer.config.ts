import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

// Multer configuration for handling file uploads.
// Files are saved to the /media directory with a unique name to avoid collisions.
export const multerConfig = {
    storage: diskStorage({
        destination: './media', // Save files to the 'media' directory
        filename: (_req, file, cb) => {
            // Use a UUID + original extension so filenames are unique and safe
            const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
        // Only allow image files
        const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (!allowed.test(extname(file.originalname))) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB per file
    },
};
