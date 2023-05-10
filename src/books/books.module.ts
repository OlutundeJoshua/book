import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Books, TestBook } from '../entity/books';




@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController],
  providers: [
    BooksService,
    // {
    //   provide: getRepositoryToken(Books),
    //   useValue: process.env.NODE_ENV === 'development' ? Books :TestBook
    // }
  ]
})
export class BooksModule {}
