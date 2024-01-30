import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ScooterType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  describe: string;

  @Column()
  code: string;
}
