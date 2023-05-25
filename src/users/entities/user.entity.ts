import { Books } from "src/books/entity/books";
import { Profile } from "src/profiles/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @OneToOne(() => Profile, profile => profile.user)
  @JoinColumn()
  profile: Profile

  @OneToMany(() => Books, books => books.author)
  books: Books[];
}
