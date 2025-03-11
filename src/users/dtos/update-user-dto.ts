import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsOptional, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(80)
  address?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: 1234567890,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  phone?: number;

  @ApiProperty({
    description: 'The country of residence of the user',
    example: 'United States',
    required: false,
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiProperty({
    description: 'The city of residence of the user',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  city?: string;

  @ApiProperty({
    description: "Indicates if the user is an administrator",
    example: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  admin?: boolean
}