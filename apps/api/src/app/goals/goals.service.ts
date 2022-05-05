import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
    @InjectModel('Goal') private readonly goalModel: Model<Goal>
  ) {}

  colors = [
    '9261d2',
    '8751cf',
    '8144d4',
    '742fd4',
    '7a56d1',
    '624cd1',
    '5238d1',
    '3f22c9',
  ];

  empty = {
    details: '',
    finish: -1,
    ticket: '',
    title: '',
  };

  async createGoal(
    createGoalDto: CreateGoalDto,
    userId: string
  ): Promise<Goal> {
    const goal = new this.goalModel(createGoalDto);
    goal.userId = userId;
    await goal.save();
    return goal;
  }

  /**
   * Add the comments to the goal
   * @param goalId 
   * @param comment 
   * @param userId 
   * @returns 
   */
  async addComment(
    goalId: string,
    comment: string,
    userId: string
  ): Promise<Goal> {
    const goal = await this.goalModel.findById(goalId);

    if (!goal) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    if (goal.userId != userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (!goal.comments) {
      goal.comments = [];
    }
    goal.comments.push({comment, date: new Date()});

    await goal.save();
    return goal;
  }

  /**
   * Fech the latest goal and return only if finish date superior to 0 aka Today
   * @param userId
   * @returns
   */
  async getLastGoal(userId): Promise<any> {
    const list = await this.goalModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .select({
        _id: 0,
        updatedAt: 0,
        createdAt: 0,
        userId: 0,
      });
    const goal: any = list[0] || {};
    return goal?.finish === -1 || goal?.finish > 0 ? goal : this.empty;
  }

  /**
   * Search for goal with ticket
   * @param queries
   * @returns
   */
  async searchGoal(queries): Promise<any> {
    const list = await this.goalModel
      .find({ ticket: queries.ticket })
      .sort({ createdAt: -1 })
      .limit(1)
      .select({
        _id: 0,
        updatedAt: 0,
        createdAt: 0,
        userId: 0,
      });
    return list[0] || this.empty;
  }

  /**
   * Get all the goals
   * @param options
   * @returns
   */
  async getAllGoals(options): Promise<any> {
    const goals = [];
    const date = options.from;
    let init = {};
    let filters = [];

    const setFilters = (key: string, type: string) => {
      if (options[key] == 'true') {
        filters.push(type);
      } else {
        const index = filters.find((f) => f === type);
        if (index >= 0) {
          filters.splice(index, 1);
        }
      }
    };

    Object.keys(options).forEach((key) => {
      switch (key) {
        case 'front': {
          setFilters(key, 'frontend');
          break;
        }
        case 'back': {
          setFilters(key, 'backend');
          break;
        }
      }
    });

    const monday = this.utilsDates.getMonday(date);
    const friday = new Date(
      this.utilsDates
        .getMonday(date)
        .setDate(this.utilsDates.getMonday(date).getDate() + 5)
    );

    // without deletedAt
    let filt = {
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
    };

    if (filters.length > 0) {
      filt = { ...filt, ...{ teams: { $in: filters } } };
    }

    const users = await this.userModel.find(filt).sort({ name: 1 });

    // create table of dates
    const initialize = (initial, date) => {
      for (let index = 0; index < 5; index++) {
        initial[this.utilsDates.getFormatDate(date, null, index)] = [];
      }

      return initial;
    };

    // get data for each user
    for (let index = 0; index < users.length; index++) {
      const user_id = users[index]._id;
      const data = await this.goalModel
        .find({
          userId: user_id,
          createdAt: {
            $gte: this.utilsDates.getFormatDate(monday, '-'),
            $lte: this.utilsDates.getFormatDate(friday, '-'),
          },
        })
        .sort({ createdAt: 1 });

      const modaledGoals = await this.modalGoals(data, initialize(init, date));
      goals.push({
        user: users[index].name,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        data: Object.values(modaledGoals),
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
      const yesterday = this.utilsDates.getFormatDate(
        current.createdAt,
        null,
        -1
      );

      if (!acc[date]) {
        acc[date] = [];
      }

      if (acc[yesterday] && Array.isArray(acc[yesterday])) {
        exist = acc[yesterday].findIndex(
          (goal: Goal) => goal.ticket === current.ticket
        );
      }

      current.days = 1;

      if (exist === undefined || exist < 0) {
        acc[date].push(current);
      } else if (exist >= 0) {
        const tmp = { ...acc[yesterday][exist] };
        acc[yesterday][exist] = current;
        acc[yesterday][exist].days += 1;
        acc[yesterday][exist].previous.push(tmp);
        for (let index = 0; index <= exist; index++) {
          acc[date].splice(index, 0, {});
        }
      }

      return acc;
    }, Promise.resolve(init));
  }
}
