import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksDto } from './dto/books.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Books } from './entity/books';
import { PaginateQuery } from 'nestjs-paginate';

describe('BooksController', () => {
  let controller: BooksController;
  let fakeBooksService;

  beforeEach(async () => {
    fakeBooksService = {
      createBook: jest.fn((book: BooksDto) => {
        return {
          id: 1,
         ...book
        } 
      }),
      
      updateBook: jest.fn((id: number, book: UpdateBookDto) => {
        return Promise.resolve({
          id,
          title: book.title ? book.title : 'original',
          content: book.content ? book.content : 'original'
        })
      }),
      
      getBook: jest.fn((id: number) => {
        return Promise.resolve({
          id,
          title: 'foo',
          content: 'content'
        })
      }),
      
      getBookByUser: jest.fn((id: number) => {
        return Promise.resolve([{
          id,
          title: 'foo',
          content: 'content'
        } as Books])
      }),
      
    getBooks: jest.fn(() =>{
      return Promise.resolve([{
        id: 1,
        title: 'foo',
        content: 'content'
      } as Books])
    }),

    deleteBook: jest.fn((id: number) => Promise.resolve({
      id: 1,
      title: 'foo',
      content: 'content'
    }))
  }


    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: fakeBooksService
        }
      ]
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });


  it('create a book',  async () => {
    const book = await controller.createBook({userId: 1, title: 'foo', content: 'Test'});
    expect(book).toBeDefined()
    expect(fakeBooksService.createBook).toHaveBeenCalled()
  })

  it('findBook return a book with given id', async () => {
    const book = await controller.getBook(1)
    expect(book).toBeDefined()
    expect(fakeBooksService.getBook).toHaveBeenCalled()
  });

  it('findBooksByUser returns books for a specific user', async () => {
    const book = await controller.getBookByUser(1)
    expect(book).toBeDefined()
    expect(fakeBooksService.getBookByUser).toHaveBeenCalled()
  })

  it('findBooks return all the books', () => {
    let query: PaginateQuery
    const books = controller.getBooks(query);
    expect(books).toBeDefined();
    expect(fakeBooksService.getBooks).toHaveBeenCalled()
  })

  it('updateBook should update a book with given id', async () => {
    const book = await controller.updateBook(1, {title: 'Hello World'})
    expect(book).toBeDefined()
    expect(fakeBooksService.updateBook).toHaveBeenCalled()
  })


  it ('DeleteBook should delete a book', async () => {
    const book = await (controller.deleteBook(1))
    expect(book).toBeDefined()
    expect(fakeBooksService.deleteBook).toHaveBeenCalled()
  })

});

