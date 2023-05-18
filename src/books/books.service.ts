import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Books } from '../entity/books';
import { BooksDto } from '../dto/books.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, FilterSuffix, Paginate, PaginateQuery, paginate, Paginated } from 'nestjs-paginate'
// import { Observable } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Books) 
  private booksRepository: Repository<Books>) {}
    
  async createBook(book: BooksDto) {
    const newBook = await this.booksRepository.create(book);
    return this.booksRepository.save(newBook);
  }
  
  async getBooks(query: PaginateQuery): Promise<Paginated<Books>>{
    // return this.booksRepository.find();
    return paginate(query, this.booksRepository, {
      sortableColumns: ['id', 'title', 'content'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['title', 'content'],
      maxLimit: 5,
    })
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
    return this.booksRepository.save({id, ...book});
  }

  async deleteBook(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if(!book) {
      throw new NotFoundException('Book not found')
    }
    return await this.booksRepository.remove(book)
  }
}
