import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Books } from 'src/books/entity/books';

describe('Book System (e2e)', () => {
  let app: INestApplication;
  let _books: Books[]
  
  beforeEach(async () => {
    _books = [{
      id: '1',
      title: 'title',
      content: 'content'
    }]
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ 
        {
          provide: 'BOOK',
          useValue: _books
        }],
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

  it('/ (GETONEBOOK) Should throw an error if id is not found', () => {
    return request(app.getHttpServer())
    .get('/books/1')
    .expect(404)
  })

});
