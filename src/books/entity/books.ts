import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Books {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('varchar')
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.books, {onDelete: 'CASCADE'})
  author: User
}
