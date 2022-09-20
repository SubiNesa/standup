import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { GoalsModule } from './goals/goals.module';
import { UsersModule } from './users/users.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GoalsModule,
    UsersModule,
    AuthModule,
    RewardsModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController]
})
export class AppModule {}
