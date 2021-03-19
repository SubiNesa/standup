import { Controller, Get, Post, Put, Body, UseGuards, Req, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
// import { Roles } from './../auth/decorators/roles.decorator';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
// import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { UsersService } from './users.service';
// import { AuthGuard, PassportModule } from '@nestjs/passport';
// import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiBearerAuth,
    // ApiImplicitHeader,
    ApiOperation,
    } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
// @UseGuards(RolesGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    // @UseGuards(AuthGuard('jwt'))
    // @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({summary: 'A private route for check the auth'})
    // @ApiImplicitHeader({
    //     name: 'Bearer',
    //     description: 'the token we need for auth.'
    // })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async findAll() {
        return await this.usersService.findAllUsers();
    }

    @Get('/:id')
    // @UseGuards(AuthGuard('jwt'))
    // @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({summary: 'A private route for check the auth'})
    // @ApiImplicitHeader({
    //     name: 'Bearer',
    //     description: 'the token we need for auth.'
    // })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async findOne(@Param() params) {
        return await this.usersService.findOneUser(params.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: 'Create user'})
    @ApiCreatedResponse({})
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Put('/:id')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: 'Update user'})
    @ApiCreatedResponse({})
    async update(@Param() params, @Body() createUserDto: CreateUserDto) {
        return await this.usersService.update(params.id, createUserDto);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Login User'})
    @ApiOkResponse({})
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.usersService.login(loginUserDto);
    }

    // @Post('refresh-access-token')
    // @HttpCode(HttpStatus.CREATED)
    // @ApiOperation({summary: 'Refresh Access Token with refresh token'})
    // @ApiCreatedResponse({})
    // async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
    //     return await this.usersService.refreshAccessToken(refreshAccessTokenDto);
    // }

    // @Post('forgot-password')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({summary: 'Forgot password'})
    // @ApiOkResponse({})
    // async forgotPassword(@Req() req: Request, @Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    //     return await this.usersService.forgotPassword(req, createForgotPasswordDto);
    // }

    // @Post('forgot-password-verify')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({summary: 'Verfiy forget password code'})
    // @ApiOkResponse({})
    // async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
    //     return await this.usersService.forgotPasswordVerify(req, verifyUuidDto);
    // }

    // @Post('reset-password')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({summary: 'Reset password after verify reset password',})
    // @ApiBearerAuth()
    // @ApiImplicitHeader({
    //     name: 'Bearer',
    //     description: 'the token we need for auth.'
    // })
    // @ApiOkResponse({})
    // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    //     return await this.usersService.resetPassword(resetPasswordDto);
    // }
}