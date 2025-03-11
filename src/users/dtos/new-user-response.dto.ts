import { ApiProperty } from '@nestjs/swagger'; 
import { IsUUID } from 'class-validator';

export class NewUserResponseDto {
  @ApiProperty({
    description: 'User UUID',
  })
  @IsUUID("4")
  id: string;
  

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: 1234567890,
    required: false,
  })
  phone?: number;

  @ApiProperty({
    description: 'User country',
    example: 'United States',
    required: false,
  })
  country?: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main St, Springfield',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'User city',
    example: 'Springfield',
    required: false,
  })
  city?: string;

  @ApiProperty({
    description: 'Indicates if the user is an administrator',
    example: false,
  })
  isAdmin: boolean;
}