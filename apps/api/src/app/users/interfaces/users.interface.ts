import { Document } from 'mongoose';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    roles: [string];
    teams: [string];
    projects: [string];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    settings?: Object;
    rewards?: Reward;
}

interface Reward {
    drinks: number,
    food: number
}