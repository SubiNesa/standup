import { Module } from '@nestjs/common';

import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

import { MongooseModule } from '@nestjs/mongoose';
import { RewardSchema } from './schemas/rewards.schema';
import { UserSchema } from '../users/schemas/users.schema';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reward', schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService, AuthService],
})
export class RewardsModule {}
