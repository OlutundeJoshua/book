import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Books } from './entity/books';
import { User } from 'src/users/entities/user.entity';
import { Genre } from '../genre/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books, User, Genre])],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
