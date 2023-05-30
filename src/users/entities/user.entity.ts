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

  @Column({nullable: true})
  profileId: number;

  @OneToOne(() => Profile, profile => profile.user, {onDelete: 'SET NULL'})
  @JoinColumn()
  profile: Profile

  @OneToMany(() => Books, books => books.user)
  books: Books[];
}
