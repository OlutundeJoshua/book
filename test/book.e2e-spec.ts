import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Books } from '../src/books/entity/books';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';


describe('Book System (e2e)', () => {
  let app: INestApplication;

  const mockRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((book) => Promise.resolve({ id: 1, ...book})),
    find: jest.fn(() => Promise.resolve([])),
    findOneBy: jest.fn(({ id }) => Promise.resolve({ id, title: 'title', content: 'content'})),
    remove: jest.fn(({ id }) => Promise.resolve({ id, title: 'title', content: 'content'}))
  }
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(Books),
          useValue: mockRepo
        }]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
  });

  it('/ (CREATE)',  () => {
    return request(app.getHttpServer())
    .post('/books')
    .send({title: 'title', content: 'content'})
    .expect(201)
    .then((res) => {
      const {id, title, content} = res.body;
      expect(id).toBeDefined();
      expect(title).toEqual('title');
      expect(content).toEqual('content');
    })
  })
  
  it('/ (GETONE return a book given its Id)', () => {
    return request(app.getHttpServer())
    .get('/books/1')
    .expect(200)
  })

  it('/ (GETONEBOOK) Should throw an error if id is not found', () => {
    return request(app.getHttpServer())
    .get('/books/1000')
    .expect(404)
  })

  it('/ (UPDATE) should throw an error if id is not found', () => {
    return request(app.getHttpServer())
    .patch('/books/1000')
    .expect(404)
  })

  it('/ (DELETE) should throw an error if id is not found', () => {
    return request(app.getHttpServer())
    .delete('/books/1000')
    .expect(404)
  })

  it('/UPDATE should update a book given id', () => {
    return request(app.getHttpServer())
    .patch('/books/1')
    .send({ title: 'updated'})
    .then((res) => {
      const {id, title, content} = res.body;
      expect(id).toBeDefined();
      expect(title).toEqual('updated');
    })
  })

  it('/DELETE should delete a book given id', () => {
    return request(app.getHttpServer())
    .delete('/books/9')
    .expect(200)
  })

});
