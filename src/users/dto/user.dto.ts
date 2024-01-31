import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
