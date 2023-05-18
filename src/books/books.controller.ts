import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksDto } from './dto/books.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { Books } from 'src/books/entity/books';

@Controller('books')
export class BooksController {

  constructor(private booksService: BooksService ){}
  
  @Post()
  createBook(@Body() book: BooksDto) {
    return this.booksService.createBook(book)
  }

  @Get()
  getBooks(@Paginate() query: PaginateQuery): Promise<Paginated<Books>> {
    return  this.booksService.getBooks(query);
  }

  @Get('/:id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBook(id);
  }

  @Patch('/:id')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookDto
  ) {
    return this.booksService.updateBook(id, body);
  }

  @Delete('/:id')
  deleteBook (@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }

}
