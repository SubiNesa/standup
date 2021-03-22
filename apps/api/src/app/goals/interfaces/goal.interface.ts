import { Document } from 'mongoose';

export interface Goal extends Document {
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