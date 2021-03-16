import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [GoalsModule, MongooseModule.forRoot('mongodb://localhost:27017/standup')]
})
export class AppModule {}
