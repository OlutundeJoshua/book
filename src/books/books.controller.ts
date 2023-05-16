import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksDto } from '../dto/books.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Controller('books')
export class BooksController {

  constructor(private booksService: BooksService ){}
  
  @Post()
  createBook(@Body() book: BooksDto) {
    return this.booksService.createBook(book)
  }

  @Get()
  getBooks() {
    return  this.booksService.getBooks();
  }

  @Get('/:id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    const book = this.booksService.getBook(id);
    return book;
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
