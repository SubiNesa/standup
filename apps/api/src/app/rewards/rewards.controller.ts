import {
  Controller,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RewardsService } from './rewards.service';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  // swagger
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all rewards' })
  @ApiBearerAuth()
  @ApiOkResponse({})
  async getAllRewards(@Req() req) {
    return await this.rewardsService.getAllRewards(req?.user?._id);
  }

  @Post(':userId/:action')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  //@Roles('admin')
  @ApiOperation({ summary: 'Update reward' })
  @ApiBearerAuth()
  @ApiCreatedResponse({})
  async updateReward(@Req() req, @Param() params) {
    return await this.rewardsService.updateReward(
      req?.user?._id,
      params.userId,
      params.action
    );
  }
}
