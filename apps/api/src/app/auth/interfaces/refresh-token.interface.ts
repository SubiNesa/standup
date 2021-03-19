import { User } from '../../users/interfaces/users.interface';
import { Document } from 'mongoose';

export interface RefreshToken extends Document {
    userId: User;
    refreshToken: string;
}