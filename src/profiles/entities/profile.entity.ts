import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  gender: string;

  @Column('varchar')
  phoneNumber: string

  @Column('int')
  age: number

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE'})
  user: User
}
