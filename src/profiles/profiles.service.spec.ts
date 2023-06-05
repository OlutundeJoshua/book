import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';

describe('ProfilesService', () => {
  let service: ProfilesService;

  const mockRepository = {
    save: jest.fn((dto) => Promise.resolve({id: 1, ...dto})),
    find: jest.fn(() => Promise.resolve([])),
    findOneBy: jest.fn(({id}) => {
      if(id > 900) {
        throw new NotFoundException('Profile not found')
      }
      return Promise.resolve({
        id,
        age: 20,
        phoneNumber: '123',
        gender: 'male'
      })
      }
    ),
    remove: jest.fn((id: number) => {
      return Promise.resolve({
      id,
      age: 20,
      phoneNumber: '123',
      gender: 'male'
    })}
    ),
  }

  const userMockRepository = {
    findOneBy: jest.fn(({id}) => {
      if(id > 900) {
        throw new NotFoundException('User not found')
      }
      return {
        id: id,
        name: 'Name',
        email: 'email@example.com',
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesService,
      {
        provide: getRepositoryToken(Profile),
        useValue: mockRepository
      },
      {
        provide: getRepositoryToken(User),
        useValue: userMockRepository
      }
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('CREATE should create a new profile', async () => {
    const profile = await service.create({ id: 1, gender: 'male', age: 20, phoneNumber: '123'});
    expect(profile.gender).toEqual('male');
    expect(profile.age).toEqual(20);
    expect(userMockRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  })

  it('FIND should return all profiles', async () => {
    const profiles = await service.findAll();
    expect(profiles).toBeDefined();
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  })

  it('FINDONE should return a profile', async () => {
    const profile = await service.findOne(1)
    expect(profile).toEqual({
      id: 1,
      age: 20,
      phoneNumber: '123',
      gender: 'male'
    })
    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1)
  })

  it('FINDONE throws an error if profile id is not found', async () => {
    expect(service.findOne(1000)).rejects.toThrow(NotFoundException)
 })

 it('UPDATE should update profile', async () => {
    const profile = await service.update(1, {gender: 'female', age: 49})
    expect(profile.gender).toEqual('female');
    expect(profile.age).toEqual(49);
    expect(mockRepository.findOneBy).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
  })

  it('UPDATE throws an error if profile id is not found', async () => {
    expect(service.update(1000, {gender: 'female', age: 49})).rejects.toThrow(NotFoundException)
  })

  it('REMOVE should delete a profile given its id', async () => {
    const profile = await service.remove(5)
    expect(profile).toBeDefined()
    expect(mockRepository.remove).toHaveBeenCalledTimes(1);
  })

  it('REMOVE throws an error if profile id is not found', async () => {
    expect(service.remove(1000)).rejects.toThrow(NotFoundException)
  })

});
