import { Module } from '@nestjs/common';

import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
