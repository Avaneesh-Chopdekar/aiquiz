import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @MaxLength(50)
  @IsEmail()
  email?: string;

  @IsOptional()
  @MaxLength(255)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password?: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @IsEnum(['STUDENT', 'TEACHER', 'ADMIN'])
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}
