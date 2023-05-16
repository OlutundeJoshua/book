import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Books {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('varchar')
  title: string;

  @Column('text')
  content: string;
}

// export const  Book: Books[] =[]
