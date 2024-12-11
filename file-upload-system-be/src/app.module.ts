import { Module, MiddlewareConsumer } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FileController } from './File/file.controller';
import { FileService } from './File/file.service';
import { FileProcessingQueue } from './File/file-processing.queue';
import { FileValidationMiddleware } from './File/file-validation.middleware';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'file-processing',
    }),
  ],
  controllers: [FileController],
  providers: [FileService, FileProcessingQueue],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileValidationMiddleware).forRoutes('files/upload');
  }
}
