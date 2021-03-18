import { Document } from 'mongoose';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    roles: [string];
    teams: [string];
    createdAt: Date;
    updatedAt: Date;
}