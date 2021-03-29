import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Goal } from './interfaces/goal.interface';
import { User } from '../users/interfaces/users.interface';
import { CreateGoalDto } from './dto/create-goal.dto';

import UtilsDates from '../../../../../libs/utils/dates';

@Injectable()
export class GoalsService {

    utilsDates = new UtilsDates();

    constructor(
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('Goal') private readonly goalModel: Model<Goal>,
    ) { }

    colors = [
        '9261d2',
        '8751cf',
        '8144d4',
        '742fd4',
        '7a56d1',
        '624cd1',
        '5238d1',
        '3f22c9'
    ];

  async createGoal(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    const goal = new this.goalModel(createGoalDto);
    goal.userId = userId;
    await goal.save();
    return goal;
  }
  
  async getAllGoals(date): Promise<any> {

    const goals = [];
    let init = {};

    const monday = this.utilsDates.getMonday(date); 
    const friday = new Date(this.utilsDates.getMonday(date).setDate(this.utilsDates.getMonday(date).getDate() + 5));

    const users = await this.userModel.find({});

    // create table of dates
    const initialize = (initial, date) => {
      for (let index = 0; index < 5; index++) {
        initial[this.utilsDates.getFormatDate(date, null, index)] = [];
      }

      return initial;
    }

    // get data for each user
    for (let index = 0; index < users.length; index++) {
      const userId = users[index]._id;
      const data = await this.goalModel.find({
        userId: userId,
        createdAt: {
          $gte: this.utilsDates.getFormatDate(monday, '-'), 
          $lte: this.utilsDates.getFormatDate(friday, '-')
        }
        
      }).sort({createdAt: 1});

      const modaledGoals = await this.modalGoals(data, initialize(init, date));

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

  /**
   * Modal the data
   * 
   * @param data 
   * @param init 
   * @returns 
   */
  private async modalGoals(data, init) {
    return await data.reduce(async (accPromise, current) => {

      let acc = await accPromise;
      let exist: any; // if ticket already exists
      const date = this.utilsDates.getFormatDate(current.createdAt);
      const yesterday = this.utilsDates.getFormatDate(current.createdAt, null, -1);

      if (!acc[date]) {
        acc[date] = [];
      }
      
      if (acc[yesterday] && Array.isArray(acc[yesterday])) {
        exist = acc[yesterday].findIndex( (goal: Goal) =>  goal.ticket === current.ticket);
      }

      current.days = 1;

      if (exist === undefined || exist < 0) {
        acc[date].push(current);
      } else if (exist >= 0) {
        const tmp = { ...acc[yesterday][exist] };
        acc[yesterday][exist] = current;
        acc[yesterday][exist].days += 1;
        acc[yesterday][exist].previous.push(tmp)
        for (let index = 0; index <= exist; index++) {
          acc[date].splice(index, 0, {});
        }
      }

      return acc;
    }, Promise.resolve(init));
  }
}
