import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, TestBook } from '../entity/books';




@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: 'BOOK',
      useValue: process.env.NODE_ENV === 'development' ? Book : TestBook
    }
  ]
})
export class BooksModule {}
