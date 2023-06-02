import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { NotFoundException } from '@nestjs/common';

describe('GenreService', () => {
  let service: GenreService;

  const mockRepository = {
    save: jest.fn((dto) => Promise.resolve({id: 1, ...dto})),
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(({ where: {id}, relations}) => {
      if(id > 900) {
        throw new NotFoundException('Genre not found')
      }
      return {
        id,
        genreName: 'Genre',
        Books: []
      }
    }),
    findOneBy: jest.fn(({id}) => {
      if(id > 900) {
        throw new NotFoundException('Genre not found')
      }
      return Promise.resolve({id, genreName: 'Genr'})
      }
    ),
    remove: jest.fn((id: number) => Promise.resolve({genreName: 'Genre'})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenreService,
      {
        provide: getRepositoryToken(Genre),
        useValue: mockRepository
      }
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('CREATE should create a new genre', async () => {
    const genre = await service.create({genreName: 'Genre'});
    expect(genre).toBeDefined();
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  })

  it('FIND should return all genres', async () => {
    const genres = await service.findAll();
    expect(genres).toBeDefined();
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  })

  it('FINDONE should reurn a genre and a list of books attached to it', async () => {
    const genre = await service.findOne(1)
    expect(genre).toEqual({
      id: 1,
      genreName: 'Genre',
      Books: []
    })
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
  })

  it('FINDONE throws an genre if book id is not found', async () => {
    expect(service.findOne(1000)).rejects.toThrow(NotFoundException)
 })

  it('UPDATE should update genre name', async () => {
    const genre = await service.update(1, {genreName: 'Genre'})
    expect(genre.genreName).toEqual('Genre');
    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalled();
  })

  it('UPDATE throws an error if genre id is not found', async () => {
    expect(service.update(1000, {genreName: 'Genre'})).rejects.toThrow(NotFoundException)
 })

  it('REMOVE should delete a genre given its id', async () => {
    const genre = await service.remove(5)
    expect(genre).toEqual({genreName: 'Genre'})
    expect(mockRepository.remove).toHaveBeenCalledTimes(1);
  })

  it('REMOVE throws an error if genre id is not found', async () => {
    expect(service.remove(1000)).rejects.toThrow(NotFoundException)
 })

});
