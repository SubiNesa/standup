import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {

    // Name
    @ApiProperty({
      example: 'Titi Toto',
      description: 'The name of the User',
      format: 'string',
      minLength: 6,
      maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly name: string;

    // Email
    @ApiProperty({
      example: 'titi@toto.com',
      description: 'The email of the User',
      format: 'email',
      uniqueItems: true,
      minLength: 5,
      maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    readonly email: string;

    // Password
    @ApiProperty({
      example: 'new password',
      description: 'The new password of the User',
      format: 'string',
      minLength: 5,
      maxLength: 1024
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)    
    readonly password: string;

    // Current
    @ApiProperty({
      example: 'Current password',
      description: 'The current password of the User',
      format: 'string',
      minLength: 5,
      maxLength: 1024
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    readonly current: string;
}