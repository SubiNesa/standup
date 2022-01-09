import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchGoalDto {
    @ApiProperty({
        example: 'Example ticket',
        description: 'ticket of goal',
        format: 'string',
        minLength: 3,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly ticket: string;
}

export class CreateGoalDto {
    @ApiProperty({
        example: 'Example ticket',
        description: 'ticket of goal',
        format: 'string',
        minLength: 3,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly ticket: string;

    @ApiProperty({
        example: 'title example ...',
        description: 'Main part of goal',
        format: 'string'
    })
    @IsString()
    readonly details: string;

    @ApiProperty({
        example: 'title example ...',
        description: 'Main part of goal',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'blocked example ...',
        description: 'if blocked',
        format: 'boolean'
    })
    @IsNotEmpty()
    @IsString()
    readonly blocked: boolean;

    @ApiProperty({
        example: 'user_id',
        description: 'user id',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    readonly userId: string;
}