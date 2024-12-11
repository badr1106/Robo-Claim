import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import pdfParse from 'pdf-parse';
import * as Tesseract from 'tesseract.js';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

interface PdfParseResult {
  text: string;
  // Add other properties if needed
}

@Processor('file-processing')
@Injectable()
export class FileProcessingQueue {
  constructor(private readonly databaseService: DatabaseService) {}

  @Process('processFile')
  async handleFileProcessing(job: Job) {
    const { file } = job.data;
    const processedData = await this.processFile(file);
    await this.storeFileMetadata(processedData);
    console.log(
      `Processed file: ${file.originalname}, Size: ${file.size} bytes`,
    );
  }

  private async processFile(file: Express.Multer.File): Promise<any> {
    const processedData: { text?: string } = {};
    if (file.mimetype === 'application/pdf') {
      const pdfText = await this.extractTextFromPDF(file);
      processedData.text = pdfText;
    }

    if (file.mimetype.startsWith('image/')) {
      const ocrText = await this.performOCR(file);
      processedData.text = ocrText;
    }

    return processedData;
  }

  private async extractTextFromPDF(file: Express.Multer.File): Promise<string> {
    try {
      const dataBuffer = file.buffer;
      const data: PdfParseResult = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async performOCR(file: Express.Multer.File): Promise<string> {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file.buffer, 'eng');
      return text;
    } catch (error) {
      console.error('Error performing OCR:', error);
      throw new Error('Failed to perform OCR');
    }
  }

  private async storeFileMetadata(data: any): Promise<void> {
    const metadata = {
      filename: data.file.originalname,
      size: data.file.size,
      mimetype: data.file.mimetype,
      text: data.text,
      processedAt: new Date(),
    };

    try {
      await this.databaseService.saveFileMetadata(metadata);
      console.log('File metadata stored successfully');
    } catch (error) {
      console.error('Error storing file metadata:', error);
      throw new Error('Failed to store file metadata');
    }
  }
}
