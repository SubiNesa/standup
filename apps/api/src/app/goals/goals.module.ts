import { Module } from '@nestjs/common';

import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

import { MongooseModule } from '@nestjs/mongoose';
import { GoalSchema } from './schemas/goal.schema';
import { UserSchema } from '../users/schemas/users.schema';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Goal', schema: GoalSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService, AuthService],
})
export class GoalsModule {}
