import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(@InjectRepository(Genre) private genreRepository: Repository<Genre>) {}

  async create(createGenreDto: CreateGenreDto) {
    return await this.genreRepository.save(createGenreDto);
  }

  async findAll() {
    return await this.genreRepository.find();
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.find({
      where: {id},
      relations: ['books']
    });
    if(!genre) {
      throw new NotFoundException('User not found')
    }
    return genre
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const user = await this.genreRepository.findOneBy({ id });
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return await this.genreRepository.save({id, ...updateGenreDto})
  }

  async remove(id: number) {
    const genre = await this.genreRepository.findOneBy({id})
    if(!genre) {
      throw new NotFoundException('User not found')
    }
    return await this.genreRepository.remove(genre)
  }
}
