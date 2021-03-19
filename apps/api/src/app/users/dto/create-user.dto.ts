import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    // name
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
      maxLength: 255,
    })
    @IsNotEmpty()
    readonly roles: string[];

    // Teams
    @ApiProperty({
      example: '[Developer, Admin]',
      description: 'The teams of the User',
      format: 'string',
      minLength: 5,
      maxLength: 255,
    })
    @IsNotEmpty()
    readonly teams: string[];

    // Projects
    @ApiProperty({
      example: '[Cookie, Biscuit]',
      description: 'The projects of the User',
      format: 'string',
      minLength: 5,
      maxLength: 255,
    })
    @IsNotEmpty()
    readonly projects: string[];

    // Password
    // @ApiProperty({
    //   example: 'secret password change me!',
    //   description: 'The password of the User',
    //   format: 'string',
    //   minLength: 5,
    //   maxLength: 1024,
    // })
    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(5)
    // @MaxLength(1024)
    // readonly password: string;
  }