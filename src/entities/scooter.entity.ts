import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { ScooterType } from './scooterType.entity';

@Entity()
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plate: string;

  @ManyToOne(() => ScooterType)
  @JoinColumn({ name: 'typeId' })
  @ApiHideProperty()
  type: ScooterType;

  @Column()
  typeId: number;

  @Column({ default: true })
  isActive: boolean;
}
