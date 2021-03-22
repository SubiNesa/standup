import { Document } from 'mongoose';

export interface Goal extends Document {
    userId: string,
    blocked: boolean,
    createdAt: Date
    days?: number;
    details: string,
    finish: number,
    ticket: string,
    title: string,
    previous: any
};