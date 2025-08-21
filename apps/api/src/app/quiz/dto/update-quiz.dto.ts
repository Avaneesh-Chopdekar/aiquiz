import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateQuizDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  title!: string;

  @IsOptional()
  @MinLength(10)
  @MaxLength(255)
  slug!: string;
}
