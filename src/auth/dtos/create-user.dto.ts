import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account. It must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      "Password must have at least a lowercase, an uppercase, a number and a special character.",
  })
  password: string;

  @ApiProperty({
    description: 'The confirmation of the password. It must match the password field.',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      "Password must have at least a lowercase, an uppercase, a number and a special character.",
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'The address of the user (optional)',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(80)
  address?: string;

  @ApiProperty({
    description: 'The phone number of the user (optional)',
    example: 1234567890,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  phone?: number;

  @ApiProperty({
    description: 'The country of residence of the user (optional)',
    example: 'United States',
    required: false,
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiProperty({
    description: 'The city of residence of the user (optional)',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  city?: string;
}