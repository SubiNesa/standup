import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    // Name
    @ApiProperty({
      example: 'Titi Toto',
      description: 'The name of the User',
      format: 'string',
      minLength: 6,
      maxLength: 255,
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
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    readonly email: string;

    // Roles
    @ApiProperty({
      example: '[Frontend, Backend]',
      description: 'The roles of the User',
      format: 'string',
      minLength: 5,
      maxLength: 255
    })
    @IsNotEmpty()
    readonly roles: string[];

    // Teams
    @ApiProperty({
      example: '[Developer, Admin]',
      description: 'The teams of the User',
      format: 'string',
      minLength: 5,
      maxLength: 255
    })
    @IsNotEmpty()
    readonly teams: string[];

    // Projects
    @ApiProperty({
      example: '[Cookie, Biscuit]',
      description: 'The projects of the User',
      format: 'string',
      minLength: 5,
      maxLength: 255
    })
    @IsNotEmpty()
    readonly projects: string[];

    // DeletedAt
    @ApiProperty({
      example: '2021-05-14T21:19:11.415+00:00',
      description: 'Date of delete',
      format: 'date'
    })
    deletedAt: Date;
  }