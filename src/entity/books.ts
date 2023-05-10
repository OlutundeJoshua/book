import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Books {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;

  @Column()
  content: string;
}

// export const  Book: Books[] =[]
