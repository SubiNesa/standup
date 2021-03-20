import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Goal } from './interfaces/goal.interface';
import { User } from '../users/interfaces/users.interface';
import { CreateGoalDto } from './dto/create-goal.dto';


@Injectable()
export class GoalsService {

    constructor(
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('Goal') private readonly goalModel: Model<Goal>,
    ) { }

    colors = [
        '093145',
        '107896',
        '829356',
        '0C374D',
        '1287A8',
        '93A661',
        '0D3D56',
        '1496BB',
        'A3B86C',
        '3C6478',
        'BCA136',
        'C2571A',
        'AD2A1A',
        'F26D21',
        'CD594A',
        'F25B4C'
    ];

  async createGoal(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    const goal = new this.goalModel(createGoalDto);
    goal.userId = userId;
    await goal.save();
    return goal;
  }
  
  async getAllGoals(date): Promise<any> {

    const goals = [];
    const init = {};

    const users = await this.userModel.find({});

    for (let index = 0; index < 5; index++) {
      const d = new Date(date);
      d.setDate(d.getDate() + index);
      init[`${d.getFullYear()}${(d.getMonth() + 1)}${d.getDate()}`] = [];
    }

    for (let index = 0; index < users.length; index++) {
      // TODO: fetch between 2 dates
      const data = await this.goalModel.find({userId: users[index]._id}).sort({createdAt: 1});
      const modaledGoals = await this.modalGoals(data, init);

      console.log('modaledGoals');
      console.log(modaledGoals);

      goals.push({
        user: users[index].name,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        data: Object.values(modaledGoals)
      });
    }

    return goals;
  }

  async getOneGoal(id: string): Promise<Goal> {
    return await this.goalModel.findById(id);
  }

  private async modalGoals(data, init) {
    return await data.reduce(async (accPromise, current) => {

      let acc = await accPromise;
      let exist: any; // if ticket already exists
      const date = `${current.createdAt.getFullYear()}${(current.createdAt.getMonth() + 1)}${current.createdAt.getDate()}`;
      const yesterday = `${current.createdAt.getFullYear()}${(current.createdAt.getMonth() + 1)}${current.createdAt.getDate() - 1}`;

      if (!acc[date]) {
        acc[date] = [];
      }
      
      if (acc[yesterday] && Array.isArray(acc[yesterday])) {
        exist = acc[yesterday].findIndex( (goal: Goal) =>  goal.ticket === current.ticket);
      }

      current.days = 1;

      if (exist < 0) {
        acc[date].push(current);
      } else if (exist >= 0) {
        acc[yesterday][exist].days += 1;
        acc[yesterday][exist].previous.push(current)
        for (let index = 0; index <= exist; index++) {
          acc[date].splice(index, 0, {});
        }
      }

      return acc;
    }, Promise.resolve(init));
  }

  // async updateGoalPut(id: string, createGoalDto: CreateGoalDto): Promise<Goal> {
  //   return await this.goalModel.updateOne({_id: id}, createGoalDto);
  // }
}
