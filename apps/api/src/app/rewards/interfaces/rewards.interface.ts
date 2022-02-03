import { Document } from 'mongoose';

export interface Reward extends Document {
  _id?: any;
  recipientId: string;
  presenterId: string;
  food: number;
  drinks: number;
}
