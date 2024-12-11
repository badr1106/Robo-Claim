import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileService.processFiles(files);
  }

  @Get()
  async getFiles() {
    return this.fileService.getFiles();
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return this.fileService.getFile(id);
  }
}
