import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';


describe('Book System (e2e)', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
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
    .get('/books/4')
    .expect(400)
  })

  it('/ (UPDATE) should throw an error if id is not found', () => {
    return request(app.getHttpServer())
    .patch('/books/4')
    .expect(400)
  })

  it('/ (DELETE) should throw an error if id is not found', () => {
    return request(app.getHttpServer())
    .delete('/books/4')
    .expect(400)
  })

  it('/UPDATE should update a book given id', () => {
    return request(app.getHttpServer())
    .patch('/books/1')
    .send({ title: 'updated'})
    .then((res) => {
      const {id, title, content} = res.body;
      expect(id).toBeDefined();
      expect(title).toEqual('updated');
      expect(content).toEqual('content');
    })
  })

  it('/DELETE should delete a book given id', () => {
    return request(app.getHttpServer())
    .delete('/books/1')
    .then((res) => {
      const {message} =res.body
      expect(message).toEqual('deleted')
    })
  })

});
