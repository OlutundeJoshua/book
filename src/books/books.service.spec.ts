import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { NotFoundException } from '@nestjs/common';
import { Books } from './entity/books';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/users/entities/user.entity';

describe('BooksService', () => {
  let service: BooksService;

  const mockRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((book) => Promise.resolve({ id: 1, ...book})),
    find: jest.fn(() => Promise.resolve([])),

    findOneBy: jest.fn(({ id }) => {
      if(id > 900) {
        throw new NotFoundException('Book not found')
      }
      return Promise.resolve({ id, title: 'title', content: 'content'})
    }),

    findBy: jest.fn(({ id }) => {
      if(id > 900) {
        throw new NotFoundException('Book not found')
      }
      return Promise.resolve([])
    }),
    
    remove: jest.fn(({ id }) => Promise.resolve({ id, title: 'title', content: 'content'}))
  }

  const genreMockRepository = {
    findOneBy: jest.fn(({ id }) => {
      if(id > 900) {
        throw new NotFoundException('Genre not found')
      }
      return Promise.resolve([])
    })
  }

  const userMockRepository = {
    findOneBy: jest.fn(({ id }) => {
      if(id > 900) {
        throw new NotFoundException('user not found')
      }
      return Promise.resolve([])
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ BooksService, 
      {
        provide: getRepositoryToken(Books),
        useValue: mockRepository
      },
      {
        provide: getRepositoryToken(Genre),
        useValue: genreMockRepository
      },
      {
        provide: getRepositoryToken(User),
        useValue: userMockRepository
      },
    ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });
  
  it('createBook should create a book', async () => {
    const book = await service.createBook({userId: 1, title: 'title', content: 'content', genreId: 1});
    expect(book.id).toBeDefined();
    expect(book.title).toEqual('title');
    expect(book.content).toEqual('content');
    expect(book.genre).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalled()
    expect(mockRepository.save).toHaveBeenCalled()
    expect(genreMockRepository.findOneBy).toHaveBeenCalled()
  })

  it('createBook should return an NotFound Execption with a wrong userId', async () => {
    await expect(service.createBook({ userId:1000, title: 'title', content: 'content'}))
      .rejects.toThrow(NotFoundException) 
  })
 
  it('createBook should return an NotFound Execption with a wrong genreId', async () => {
    await expect(service.createBook({ userId:1, title: 'title', content: 'content', genreId: 1000}))
      .rejects.toThrow(NotFoundException) 
  })
  
  // it('getBooks should return all books', async () => {
  //   let query: PaginateQuery 
  //   const books = await service.getBooks(query);
  //   expect(books).toBeDefined;
  //   // expect(mockRepository.find).toHaveBeenCalled()
  // })

  it('getBook should return a book given its id', async () => {
    const book = await service.getBook(1)
    expect(book).toEqual(
      {
        id: 1,
        title: 'title',
        content: 'content'
      }
    )
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({id:1})
    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1)
  })

  it('GetBook throws an error if book id is not found', async () => {
     expect(service.getBook(10000)).rejects.toThrow(NotFoundException)
  })

  it('getBookByUser when userId is inputted', async () => {
    const book = service.getBookByUser(1)
    expect(book).toBeDefined()
    expect(mockRepository.findBy).toHaveBeenCalledTimes(1)
  })
 
  // it('getBookByUser throws an error if userId is not found', async () => {
  //   expect(service.getBookByUser(10000)).rejects.toThrow(NotFoundException)
  // })
  
  it('should update a book given a book id', async () => {
    const book = await service.updateBook(1, {title: 'new title'});
    expect(book).toEqual({
          id: 1,
          title: 'new title'
      })
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({id: 1});
      expect(mockRepository.findOneBy).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
  })
  
  it('throws an error if book id is not found', async () => {
     expect(service.updateBook(1000, {title: 'title'})).rejects.toThrow(NotFoundException)
  })

  it ('DeleteBook should delete a book', async () => {
    const response = await (service.deleteBook(15))
    expect(response).toEqual({
      id: 15,
      title: 'title',
      content: 'content'
    });
    expect(mockRepository.remove).toHaveBeenCalledTimes(1)
  })

it('DeleteBook throws an error if book id is not found', async () => {
    expect(service.deleteBook(1000)).rejects.toThrow(NotFoundException)
 })
 
});
