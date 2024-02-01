import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Scooter } from './scooter.entity';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scooterId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @ApiHideProperty()
  user: User;

  @ManyToOne(() => Scooter)
  @JoinColumn({ name: 'scooterId' })
  @ApiHideProperty()
  scooter: Scooter;

  @Column()
  rentAt: Date;

  @Column({ default: null })
  returnAt: Date;

  @Column({ select: false })
  token: string;
}
