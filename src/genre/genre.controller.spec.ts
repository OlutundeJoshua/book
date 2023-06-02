import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

describe('GenreController', () => {
  let controller: GenreController;

  const mockService = {
    create: jest.fn((dto) => {
      return Promise.resolve({
        id: 1,
        ...dto
      })
    }),

    findAll: jest.fn(() => Promise.resolve([])),

    findOne: jest.fn((id: number) => Promise.resolve({ id, genreName: 'name' })),

    update: jest.fn((id:number, dto) => Promise.resolve({ id, ...dto})),

    remove: jest.fn((id: number) => Promise.resolve({}))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: mockService
        }
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  it('create should create a new genre', async () => {
    const genre = await controller.create({genreName: 'genre'});
    expect(genre).toBeDefined();
    expect(mockService.create).toHaveBeenCalled();
  })

  it('findAll should return all users', async () => {
    const users = await controller.findAll()
    expect(users).toBeDefined();
    expect(mockService.findAll).toHaveBeenCalled();
  })

  it('findOne should return a user given its id', async () => {
    const genre = await controller.findOne('1');
    expect(genre).toBeDefined();
    expect(mockService.findOne).toHaveBeenCalled();
  })

  it('update should update a genreName', async () => {
    const genre = await controller.update('1', {});
    expect(genre).toBeDefined();
    expect(mockService.update).toHaveBeenCalled();
  })

  it('remove should delete a genre given its id', async () => {
    const genre = await controller.remove('1')
    expect(genre).toBeDefined();
    expect(mockService.remove).toHaveBeenCalled();
  })
});
