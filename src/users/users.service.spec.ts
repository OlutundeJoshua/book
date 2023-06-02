import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({id:1, ...dto})),
    find: jest.fn(() => Promise.resolve([
      {
        id: 1,
        name: 'name',
        email: 'email@example.com',
      }
    ])),

    findOne: jest.fn(({ where: {id}, relations}) => {
      if(id > 900) {
        throw new NotFoundException('User not found')
      }
      return {
        id,
        name: 'Name',
        email: 'email@example.com',
        Profile: []
      }
    }),

    findOneBy: jest.fn(({ id }) => {
      if(id > 900) {
        throw new NotFoundException('User not found')
      }
      return Promise.resolve([])
    }),
  
    remove: jest.fn(({ id }) => Promise.resolve({ id, name: 'user', email: 'email@email.com'}))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository
        }      
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('create should create a user', async () => {
    const user = await service.create({ name: 'user', email: 'user@example.com' });
    expect(user.id).toBeDefined();
    expect(user.name).toEqual('user');
    expect(user.email).toEqual('user@example.com');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  })

  it('findAll should return a list of users', async () => {
    const users = await service.findAll()
    expect(users).toBeDefined();
    expect(mockRepository.find).toHaveBeenCalledTimes(1)
  })

  it('FINDONE should reurn a user and profile attached to it', async () => {
    const user = await service.findOne(1)
    expect(user).toEqual(
      {
        id:1,
        name: 'Name',
        email: 'email@example.com',
        Profile: []
      }
    )
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
  })

  it('findOne throws an error if user id is not found', async () => {
    expect(service.findOne(1000)).rejects.toThrow(NotFoundException)
  })  

  it('update should update a user', async () => {
    const user = await service.update(1, { email: 'test@test.com'})
    expect(user).toEqual({ 
      id: 1,
      email: 'test@test.com'
    })
    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
  })

  it('update throws an error if user id is not found', async () => {
    expect(service.update(1000, { email: 'test@test.com'})).rejects.toThrow(NotFoundException)
  })

  it('remove should delete a user and return the deleted user', async () => {
    const user = await service.remove(6)
    expect(user).toEqual({
      name: 'user',
      email: 'email@email.com',
    })
    expect(mockRepository.remove).toHaveBeenCalledTimes(1);
  })

  it('REMOVE throws an error if user id is not found', async () => {
    expect(service.remove(1000)).rejects.toThrow(NotFoundException)
  })

});
