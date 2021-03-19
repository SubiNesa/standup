import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

import { GoalsModule } from './goals/goals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [GoalsModule, UsersModule, AuthModule, MongooseModule.forRoot('mongodb://localhost:27017/standup', {useFindAndModify: false})]
})
export class AppModule {}
