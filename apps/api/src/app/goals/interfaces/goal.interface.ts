import { Document } from 'mongoose';

export interface Goal extends Document {
    _id?: any;
    userId: string;
    blocked: boolean;
    createdAt: string;
    days?: number;
    details: string;
    finish: number;
    ticket: string;
    title: string;
    previous: any;
};

export interface GoalResponse {
    blocked: boolean;
    days?: number;
    details: string;
    finish: number;
    ticket: string;
    title: string;
    previous: any;
};