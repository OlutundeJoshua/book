import { User } from "src/users/entities/user.entity";
import { Column, Entity, IsNull, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Genre } from "../../genre/entities/genre.entity";

@Entity()
export class Books {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('varchar')
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.books, {onDelete: 'SET NULL'})
  user: User

  @ManyToMany(() => Genre, (genre) => genre.books)
  @JoinTable()
  genre: Genre[]
}
