import { MinLength, MaxLength } from 'class-validator';

export class CreateQuizDto {
  @MinLength(10)
  @MaxLength(255)
  prompt!: string;
}
