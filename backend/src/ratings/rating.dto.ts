import { IsInt, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  store_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
