import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Books } from './entity/books';
import { getRepositoryToken } from '@nestjs/typeorm';

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
    
    remove: jest.fn(({ id }) => Promise.resolve({ id, title: 'title', content: 'content'}))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ BooksService, 
      {
        provide: getRepositoryToken(Books),
        useValue: mockRepository
      }
    ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('getBooks should return all books', async () => {

    const books = await service.getBooks();
    expect(books).toBeDefined;
    expect(mockRepository.find).toHaveBeenCalled()
  })

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

  it('createBook should create a book', async () => {
    const book = await service.createBook({title: 'title', content: 'content'});
    expect(book.id).toBeDefined();
    expect(book.title).toEqual('title');
    expect(book.content).toEqual('content');
    expect(mockRepository.create).toHaveBeenCalled()
    expect(mockRepository.save).toHaveBeenCalled()
    expect(mockRepository.create).toHaveBeenCalledWith({title: 'title', content:'content'})

  })
  
  it('GetBook throws an error if book id is not found', async () => {
     expect(service.getBook(10000)).rejects.toThrow(NotFoundException)
  })
  
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
