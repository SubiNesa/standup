import { Controller, Get } from '@nestjs/common';

import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  getData() {
    return this.goalsService.getData();
  }
}
