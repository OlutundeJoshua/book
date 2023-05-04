import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksDto } from './dto/books.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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
  getBook(@Param('id') id: string) {
    return this.booksService.getBook(id);
  }

  @Patch('/:id')
  updateBook(
    @Param('id') id: string,
    @Body() body: UpdateBookDto
  ) {
    return this.booksService.updateBook(id, body);
  }

  @Delete('/:id')
  deleteBook (@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }

}
