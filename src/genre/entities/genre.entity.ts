import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Books } from "../../books/entity/books";


@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  genreName: string

  @ManyToMany(() => Books, books => books.genre)
  books: Books[]
}