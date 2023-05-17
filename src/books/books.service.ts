import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Books } from '../entity/books';
import { BooksDto } from '../dto/books.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Books) 
  private booksRepository: Repository<Books>) {}

  // constructor(@Inject('BOOK') private _books: Books[]) {}
    
  async createBook(book: BooksDto) {
    const newBook = await this.booksRepository.create(book);
    return this.booksRepository.save(newBook);
  }
  
  async getBooks() {
    return this.booksRepository.find();
  }

  async getBook(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if(!book) {
      throw new NotFoundException('Book not found')
    }
    return book
  }

  async updateBook(id:number, book:UpdateBookDto) {
    let oldBook = await this.booksRepository.findOneBy({ id });
    if(!oldBook) {
      throw new NotFoundException('Book not found')
    }

    oldBook.title = book.title ? book.title : oldBook.title;
    oldBook.content = book.content ? book.content : oldBook.content;

    // Object.assign( oldBook, book);
    return this.booksRepository.save(oldBook);
  }

  async deleteBook(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if(!book) {
      throw new NotFoundException('Book not found')
    }
    return await this.booksRepository.remove(book)
  }
}
