import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BooksService } from 'src/books/books.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const fakeUsersService ={
    create: jest.fn((userDto: CreateUserDto) => {
      return {
        id: 1,
        ...userDto
      }
    }),

    findAll: jest.fn(() => Promise.resolve([])),

    findOne: jest.fn((id:number) => {
      return Promise.resolve({
        id,
        name: 'user',
        email: 'user@example.com'
      })
    }),

    update: jest.fn((id:number, updateUserDto: UpdateUserDto) => {
    return Promise.resolve({
      id,
      ...updateUserDto
    })
  }),

    remove: jest.fn((id: number) => Promise.resolve({id, name: 'name', email: 'user@example.com'}))
  }

  const fakeBooksService = {
    getBookByUser: jest.fn((id: number) => Promise.resolve([])),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: BooksService,
          useValue:fakeBooksService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('create a new user', async () => {
    const user = await controller.create({ name: 'user', email: 'user@example.com' });
    expect(user).toBeDefined();
    expect(fakeUsersService.create).toHaveBeenCalled();
  })

  it('findAll should return an array of users', async () => {
    const users = await controller.findAll();
    expect(users).toBeDefined();
    expect(fakeUsersService.findAll).toHaveBeenCalledTimes(1)
  })

  it('findOne returns a user with userId', async () => {
    const user = await controller.findOne(1)
    expect(user).toBeDefined();
    expect(fakeUsersService.findOne).toHaveBeenCalledTimes(1)
  })
  
  it('findUsersBooks should return Books that Users have created', async () => {
    const books = await controller.findUserBooks(1)
    expect(books).toBeDefined()
    expect(fakeBooksService.getBookByUser).toHaveBeenCalled()
  })

  it('updateUser should update a users information', async () => {
    const user = await controller.update(1, {name: 'John'})
    expect(user.name).toEqual('John')
    expect(fakeUsersService.update).toHaveBeenCalled()
  })

  it('remove user given their id', async () => {
    const user = await controller.remove(1)
    expect(user).toBeDefined()
    expect(fakeUsersService.remove).toHaveBeenCalled()
  })
});
