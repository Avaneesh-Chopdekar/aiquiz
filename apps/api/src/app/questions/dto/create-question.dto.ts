import {
  MinLength,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  IsString,
  ArrayMaxSize,
  ArrayMinSize,
  Min,
  Max,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateQuestionDto {
  @MinLength(10)
  @MaxLength(255)
  text!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MinLength(2, { each: true })
  @MaxLength(255, { each: true })
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  options!: string[];

  @IsInt()
  @Min(0)
  @Max(3)
  correctOptionIndex!: number;

  @IsString()
  @IsUUID()
  quizId!: string;
}
