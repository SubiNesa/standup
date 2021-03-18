import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GoalsModule } from './goals/goals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [GoalsModule, UsersModule, MongooseModule.forRoot('mongodb://localhost:27017/standup', {useFindAndModify: false})]
})
export class AppModule {}
