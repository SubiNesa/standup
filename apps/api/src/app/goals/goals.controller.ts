import { Controller, Get, Post, Req, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { GoalsService } from './goals.service';

import { CreateGoalDto } from './dto/create-goal.dto';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}


  @Get(':date')
  // swagger
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all goals' })
  @ApiOkResponse({})
  async getAllGoal(@Param() params) {
    return await this.goalsService.getAllGoals(params.date);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  //@Roles('admin')
  @ApiOperation({summary: 'Create one goal'})
  @ApiBearerAuth()
  @ApiCreatedResponse({})
  async createGoal(@Req() req, @Body() createGoalDto: CreateGoalDto) {
      return await this.goalsService.createGoal(createGoalDto, req?.user?._id);
  }
}
