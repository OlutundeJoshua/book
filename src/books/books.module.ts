import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Books } from '../entity/books';




@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController],
  providers: [
    BooksService,
    // {
    //   provide: 'BOOK',
    //   useValue: process.env.NODE_ENV === 'development' ? Book : TestBook
    // }
  ]
})
export class BooksModule {}
