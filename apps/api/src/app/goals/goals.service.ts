import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Goal } from './interfaces/goal.interface';
import { CreateGoalDto } from './dto/create-goal.dto';


@Injectable()
export class GoalsService {

    constructor(
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

  async createGoal(createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = new this.goalModel(createGoalDto);
    await goal.save();
    return goal;
  }
  
  async getAllGoals(date): Promise<any> {
    const data = await this.goalModel.find({}).sort({createdAt: 1});
    const init = {};

    for (let index = 0; index < 4; index++) {
      const d = new Date(date);
      d.setDate(d.getDate() + index);
      init[`${d.getFullYear()}${(d.getMonth() + 1)}${d.getDate()}`] = [];
    }

    const goals = data.reduce((acc, current) => {
      let exist: any; // if ticket already exists
      const date = `${current.createdAt.getFullYear()}${(current.createdAt.getMonth() + 1)}${current.createdAt.getDate()}`;
      const yesterday = `${current.createdAt.getFullYear()}${(current.createdAt.getMonth() + 1)}${current.createdAt.getDate() - 1}`;
      
      if (!acc[date]) {
        acc[date] = [];
      }
      
      if (acc[yesterday] && Array.isArray(acc[yesterday])) {
        exist = acc[yesterday].find( (goal: Goal) =>  goal.ticket === current.ticket);
      }

      current.days = 1;

      if (!exist) {
        acc[date].push(current);
      } else {
        acc[date].push({});

        acc[yesterday] = acc[yesterday].map((goal: Goal): Goal => {
          if (goal.ticket === current.ticket) {
            current.days += 1;
            current.previous.push(goal);
          }
          console.log(current);
          
          return current;
        });
      }

      return acc;
    }, init);

    return [{
      user: 'Thomas',
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      data: Object.values(goals)
    }];
  }

  async getOneGoal(id: string): Promise<Goal> {
    return await this.goalModel.findById(id);
  }

  // async updateGoalPut(id: string, createGoalDto: CreateGoalDto): Promise<Goal> {
  //   return await this.goalModel.updateOne({_id: id}, createGoalDto);
  // }
  
  getData(): any {
    return [{
        user: 'Thomas',
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        data: [
          [
            {
              ticket: 'JIRA-12',
              title: 'Something',
              days: 2,
              finish: 2,
              blocked: false,
              details: 'something something'
            },
            {
              ticket: 'JIRA-16',
              title: 'Something',
              days: 4,
              finish: 4,
              blocked: false,
              details: 'something something'
            }
          ],
          [
            {},
            {},
            {
              ticket: 'JIRA-13',
              title: 'Something',
              days: 1,
              finish: 1,
              blocked: false,
              details: 'something something'
            }
          ],
          null,
          [    
            {},
            {},
            {
              ticket: 'JIRA-14',
              title: 'Something',
              days: 1,
              finish: 1,
              blocked: false,
              details: 'something something'
            },
            {
              ticket: 'JIRA-15',
              title: 'Something',
              days: 1,
              finish: 1,
              blocked: false,
              details: 'something something'
            }
          ],
          null
        ]
      }];
  }
}
