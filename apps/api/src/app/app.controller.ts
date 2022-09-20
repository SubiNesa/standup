import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller('app')
export class AppController {
  constructor() {}

  @Get()
  // swagger
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get app info' })
  @ApiOkResponse({})
  async getAllGoal() {
    return { ticket_link: process.env.TICKET_LINK };
  }
}
