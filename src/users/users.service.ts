import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto)
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: {id},
      relations: ['profile']
    });
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersRepository.save({id, ...updateUserDto})
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersRepository.remove(user);
  }
}
