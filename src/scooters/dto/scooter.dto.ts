import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScooterDto {
  @IsString()
  plate: string;

  @IsNumber()
  typeId: number;
}

export class UpdateScooterDto {
  @IsString()
  @IsOptional()
  plate?: string;

  @IsNumber()
  @IsOptional()
  typeId?: number;
}
