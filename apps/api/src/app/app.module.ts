import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { GoalsModule } from './goals/goals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), GoalsModule, UsersModule, AuthModule, MongooseModule.forRoot(process.env.MONGO_URI, {useFindAndModify: false})]
})
export class AppModule {}
