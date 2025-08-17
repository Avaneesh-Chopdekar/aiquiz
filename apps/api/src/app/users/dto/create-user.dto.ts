import {
  IsEmail,
  IsStrongPassword,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @MaxLength(50)
  @IsEmail()
  email!: string;

  @MaxLength(255)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;

  @MinLength(3)
  @MaxLength(50)
  @IsEnum(['STUDENT', 'TEACHER', 'ADMIN'])
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
}
