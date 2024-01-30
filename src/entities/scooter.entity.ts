import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScooterType } from './scooterType.entity';

@Entity()
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plate: string;

  @ManyToOne(() => ScooterType)
  @JoinColumn({ name: 'typeId' })
  type: ScooterType;

  @Column()
  typeId: number;

  @Column({ default: true })
  isActive: boolean;
}
