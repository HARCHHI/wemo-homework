import { IsNumber, IsString } from 'class-validator';

export class CreateRentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  scooterId: number;
}

export class ReturnScooterDto {
  @IsNumber()
  userId: number;

  @IsString()
  token: string;
}
