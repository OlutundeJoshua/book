import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  const mockService = {
    create: jest.fn((dto) => {
      return Promise.resolve({
        id: 1,
        ...dto
      })
    }),

    findAll: jest.fn(() => Promise.resolve([])),

    findOne: jest.fn((id: number) => Promise.resolve({})),

    update: jest.fn((id:number, dto) => Promise.resolve({ id, ...dto})),

    remove: jest.fn((id: number) => Promise.resolve({}))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide:ProfilesService,
          useValue: mockService
        }
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('create should create a new genre', async () => {
    const profile = await controller.create({id: 1, gender: 'male', age: 20, phoneNumber: '123'});
    expect(profile).toBeDefined();
    expect(mockService.create).toHaveBeenCalled();
  })

  it('findAll should return all users', async () => {
    const profiles = await controller.findAll()
    expect(profiles).toBeDefined();
    expect(mockService.findAll).toHaveBeenCalled();
  })

  it('findOne should return a user given its id', async () => {
    const profile = await controller.findOne('1');
    expect(profile).toBeDefined();
    expect(mockService.findOne).toHaveBeenCalled();
  })

  it('update should update a genreName', async () => {
    const profile = await controller.update('1', {});
    expect(profile).toBeDefined();
    expect(mockService.update).toHaveBeenCalled();
  })

  it('remove should delete a genre given its id', async () => {
    const profile = await controller.remove('1')
    expect(profile).toBeDefined();
    expect(mockService.remove).toHaveBeenCalled();
  })

});
