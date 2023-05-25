import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Books } from './entity/books';
import { BooksDto } from './dto/books.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate'
import { User } from 'src/users/entities/user.entity';
import { Genre } from 'src/genre/entities/genre.entity';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Books) private booksRepository: Repository<Books>, @InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Genre) private genreRepository: Repository<Genre>) {}  
    
  async createBook(book: BooksDto) {
    const user = await this.userRepository.findOneBy({id: book.userId});
    if(!user) {
      throw new NotFoundException(`User with id: '${book.userId}' not found`) 
    }
    const newBook = await this.booksRepository.create(book);

    //Adding author/user to the new book
    newBook.user = user

    //Adding genre to the new book
    if(book.genreId) {
        const genre = await this.genreRepository.findOneBy({id: book.genreId});
      if(!genre) {
        throw new NotFoundException(`Genre with id: '${book.genreId}' not found`) 
      }
      // console.log(genre)
      // newBook.genre.push(genre)
    }
    return await this.booksRepository.save(newBook);
  }
  
  async getBooks(query: PaginateQuery): Promise<Paginated<Books>>{
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

  async getBookByUser(id: number) {
    const book = await this.booksRepository.findBy({ userId: id });
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
