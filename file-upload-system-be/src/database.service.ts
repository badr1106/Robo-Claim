import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileMetadata } from './File/file-metadata.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(FileMetadata)
    private readonly fileMetadataRepository: Repository<FileMetadata>,
  ) {}

  async saveFileMetadata(metadata: any): Promise<void> {
    try {
      const fileMetadata = this.fileMetadataRepository.create(metadata);
      await this.fileMetadataRepository.save(fileMetadata);
    } catch (error) {
      console.error('Error saving file metadata to the database:', error);
      throw new Error('Failed to save file metadata to the database');
    }
  }

  async getFileMetadata(id: string): Promise<FileMetadata> {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid ID format');
      }
      return await this.fileMetadataRepository.findOne({
        where: { id: numericId },
      });
    } catch (error) {
      console.error('Error retrieving file metadata from the database:', error);
      throw new Error('Failed to retrieve file metadata from the database');
    }
  }

  async getAllFileMetadata(): Promise<FileMetadata[]> {
    try {
      return await this.fileMetadataRepository.find();
    } catch (error) {
      console.error(
        'Error retrieving all file metadata from the database:',
        error,
      );
      throw new Error('Failed to retrieve all file metadata from the database');
    }
  }
}
