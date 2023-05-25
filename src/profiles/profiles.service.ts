import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>, @InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createProfileDto: CreateProfileDto) {
    const user = await this.userRepository.findOneBy({ id: createProfileDto.id });
    if(!user) {
      throw new NotFoundException('User not found, Check ID or create new User');
    }
    return await this.profileRepository.save({...createProfileDto, user});
  }

  async findAll() {
    return await this.profileRepository.find();
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOneBy({ id });
    if(!profile) {
      throw new NotFoundException('User not found');
    }
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOneBy({ id });
    if(!profile) {
      throw new NotFoundException('User not found');
    }
    return await this.profileRepository.save({id, ...updateProfileDto});
  }

  async remove(id: number) {
    const profile = await this.profileRepository.findOneBy({ id });
    if(!profile) {
      throw new NotFoundException('User not found');
    }
    return await this.profileRepository.remove(profile);  
  }
}
