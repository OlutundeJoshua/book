import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Books } from '../entity/books';
import { BooksDto } from '../dto/books.dto';
import {v4} from 'uuid';
import { UpdateBookDto } from '../dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(@Inject('BOOK') private _books: Books[]) {}
    
  createBook(book: BooksDto) {
    const newBook = { ...book, id: v4() }
    this._books.push(newBook);
    
    return newBook
  }
  
  async getBooks(): Promise<Books[]> {
    return this._books;
  }

  async getBook(id: string): Promise<Books> {
    const book = await this._books.find(book => book.id === id)
    if(!book) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND)
    }

    return book
  }

  async updateBook(id:string, book:UpdateBookDto) {
    let oldBook = await this._books.find(book => book.id === id)
    if(!oldBook) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND)
    }

    // oldBook.title = book.title ? book.title : oldBook.title;
    // oldBook.content = book.content ? book.content : oldBook.content;

    let newBook = Object.assign( oldBook, book);

    oldBook = newBook;
    return oldBook;
    
  }

  async deleteBook(id: string) {
    const book = await this._books.find(book => book.id === id)
    if(!book) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND)
    }
   
    this._books = this._books.filter(book => book.id !== id)
    return { message: 'deleted'}
  }
}
