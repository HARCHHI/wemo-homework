export class CreateScooterDto {
  plate: string;

  typeId: number;
}

export class UpdateScooterDto {
  plate?: string;

  typeId?: number;
}
