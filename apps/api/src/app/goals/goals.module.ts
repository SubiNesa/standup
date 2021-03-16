import { Module } from '@nestjs/common';

import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

import { MongooseModule } from '@nestjs/mongoose';
import { GoalSchema } from './schemas/goal.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Goal', schema: GoalSchema}])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
