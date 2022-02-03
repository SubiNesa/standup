import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserPasswordDto,
  UpdateUserSettingsDto,
} from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get('/one/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one user' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async findOne(@Param() params) {
    return await this.usersService.findOneUser(params.id);
  }

  @Post('one')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save new user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Put('/one/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
  async update(@Param() params, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.update(params.id, createUserDto);
  }

  @Put('/one/:id/restore')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
  async restore(@Param() params, @Body() createUserDto: CreateUserDto) {
    createUserDto.deletedAt = null;
    return await this.usersService.update(params.id, createUserDto);
  }

  @Delete('/one/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({})
  async delete(@Param() params) {
    return await this.usersService.delete(params.id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({})
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async findConnectedUser(@Req() req) {
    return req.user;
  }

  @Get('/me/settings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async findConnectedUserSettings(@Req() req) {
    return await this.usersService.getUserSettings(req.user._id);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async updateConnectedUser(
    @Req() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ) {
    if (req.user.email !== updateUserPasswordDto.email) {
      throw new BadRequestException('Wrong user.');
    }
    return await this.usersService.updatePassword(updateUserPasswordDto);
  }

  @Put('me/settings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user settings' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async updateConnectedUserSettings(
    @Req() req,
    @Body() updateUserSettings: UpdateUserSettingsDto
  ) {
    return await this.usersService.updateSettings(
      req.user._id,
      updateUserSettings
    );
  }
}
