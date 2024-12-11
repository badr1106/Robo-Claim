import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { File as MulterFile } from 'multer';

@Injectable()
export class FileValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Validate file type and size
    const files = req.files as MulterFile[];
    for (const file of files) {
      if (
        !['application/pdf', 'image/jpeg', 'image/png'].includes(
          file.mimetype,
        ) ||
        file.size > 5 * 1024 * 1024
      ) {
        return res.status(400).send('Invalid file type or size');
      }
    }
    next();
  }
}
