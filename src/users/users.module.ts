import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { BooksService } from 'src/books/books.service';
import { Books } from 'src/books/entity/books';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Books])],
  controllers: [UsersController],
  providers: [UsersService, BooksService]
})
export class UsersModule {}
