import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { GoalsService } from './goals.service';

import { CreateGoalDto, SearchGoalDto } from './dto/create-goal.dto';
import { of } from 'rxjs';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  // swagger
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all goals' })
  @ApiOkResponse({})
  async getAllGoal(@Query() queries) {
    return await this.goalsService.getAllGoals(queries);
  }

  @Get('search')
  // swagger
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get goal via search' })
  @ApiOkResponse({})
  async searchGoal(@Query() queries: SearchGoalDto) {
    if (!queries.ticket) {
      return of();
    }
    return await this.goalsService.searchGoal(queries);
  }

  @Get('last')
  // swagger
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get last goal' })
  @ApiOkResponse({})
  async getLastGoal(@Req() req) {
    return await this.goalsService.getLastGoal(req.user._id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  //@Roles('admin')
  @ApiOperation({ summary: 'Create one goal' })
  @ApiBearerAuth()
  @ApiCreatedResponse({})
  async createGoal(@Req() req, @Body() createGoalDto: CreateGoalDto) {
    return await this.goalsService.createGoal(createGoalDto, req?.user?._id);
  }
}
