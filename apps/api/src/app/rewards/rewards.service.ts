import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Reward } from './interfaces/rewards.interface';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Reward') private readonly rewardModel: Model<Reward>
  ) {}

  /**
   * Get all the rewards
   * @returns
   */
  async getAllRewards(userId: string): Promise<any> {
    const rewards = [];

    // without deletedAt
    let filt = {
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
    };

    const users = await this.userModel.find(filt).sort({ name: 1 }).select({
      _id: 1,
      name: 1,
      rewards: 1,
    });

    const now = new Date();
    const data = await this.rewardModel.find({
      presenterId: userId,
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    });

    // get data for each user
    for (let index = 0; index < users.length; index++) {
      const user: any = {
        id: users[index].id,
        name: users[index].name,
        rewards: users[index].rewards || {
          drinks: 0,
          food: 0,
        },
        voted: data.length > 0,
      };

      rewards.push(user);
    }

    return rewards;
  }

  async updateReward(
    connectedUserId: string,
    userId: string,
    action: string
  ): Promise<any> {
    // one action should be accepted per day
    // check if there is already one action alreay performed

    const now = new Date();
    const data = await this.rewardModel.find({
      presenterId: connectedUserId,
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    });

    if (data && data.length > 0) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    switch (action) {
      case 'add':
        return await this._addReward(connectedUserId, userId);

      case 'convert':
        return await this._convertReward(connectedUserId, userId);

      case 'remove':
        return await this._removeReward(connectedUserId, userId);

      default:
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  private async _addReward(connectedUserId: string, userId: string) {
    // add reward
    const reward = new this.rewardModel({
      recipientId: userId,
      presenterId: connectedUserId,
      drinks: 1,
    });
    await reward.save();
    // update user (+1 drink)
    const recipient: User = await this.userModel.findById(userId);
    // first
    if (!recipient.rewards.drinks && !recipient.rewards.food) {
      recipient.rewards = {
        drinks: 0,
        food: 0,
      };
    }

    recipient.rewards.drinks += 1;
    await recipient.save();

    return {
      id: recipient._id,
      name: recipient.name,
      rewards: recipient.rewards,
    };
  }

  private async _convertReward(connectedUserId: string, userId: string) {
    // update user (-3 drink; +1 food)
    const recipient = await this.userModel.findById(userId);
    
    if (!recipient.rewards.drinks && !recipient.rewards.food) {
      throw new HttpException('Convert not possible', HttpStatus.FORBIDDEN);
    }
    
    // 3 drink = 1 food
    if (recipient.rewards.drinks < 3) {
      throw new HttpException('No enough drinks', HttpStatus.FORBIDDEN);
    }
    
    // add reward
    const reward = new this.rewardModel({
      recipientId: userId,
      presenterId: connectedUserId,
      drinks: -3,
      food: 1,
    });
    await reward.save();

    recipient.rewards.drinks -= 3;
    recipient.rewards.food += 1;
    await recipient.save();

    return {
      id: recipient._id,
      name: recipient.name,
      rewards: recipient.rewards,
    };
  }

  private async _removeReward(connectedUserId: string, userId: string) {
    // remove
    const recipient = await this.userModel.findById(userId);

    if (!recipient.rewards.drinks && !recipient.rewards.food) {
      throw new HttpException('Rewards not found', HttpStatus.NOT_FOUND);
    }

    // add reward
    const reward = new this.rewardModel({
      recipientId: userId,
      presenterId: connectedUserId,
      drinks: -1,
    });
    await reward.save();

    if (recipient.rewards.drinks >= 1) {
      // remove -1 drink
      recipient.rewards.drinks -= 1;
      await recipient.save();
    } else if (recipient.rewards.food >= 1) {
      // if drink doesn't exist but food does, convert food to drink
      recipient.rewards.drinks += 2;
      recipient.rewards.food -= 1;
      await recipient.save();
    }

    return {
      id: recipient._id,
      name: recipient.name,
      rewards: recipient.rewards,
    };
  }
}
