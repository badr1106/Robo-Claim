import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column('text')
  text: string;

  @Column()
  processedAt: Date;
}
