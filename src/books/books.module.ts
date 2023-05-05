import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entity/books';

@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: 'BOOK',
      useValue: Book
    }
  ]
})
export class BooksModule {}
