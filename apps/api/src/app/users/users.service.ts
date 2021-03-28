import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './interfaces/users.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly authService: AuthService
    ) {}

    async findAllUsers(): Promise<any> {
        return await this.userModel.find({}).sort({email: 1});
    }

    async findOneUser(userId: string): Promise<any> {
        const user = await this.userModel.findById(userId);

        return {
            _id: user._id,
            roles: user.roles,
            teams: user.teams,
            projects: user.projects,
            name: user.name,
            email: user.email
        };
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);
        await this.isEmailUnique(user.email);
        await user.save();
        return user;
    }

    async update(id, data: CreateUserDto): Promise<User> {
        await this.isEmailUnique(data.email, id);
        const user = await this.userModel.findByIdAndUpdate(id, data);
        return user;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.findUserByEmail(loginUserDto.email);
        await this.checkPassword(loginUserDto.password, user);
        return {
            name: user.name,
            email: user.email,
            token: await this.authService.createAccessToken(user._id)
        };
    }

    async updatePassword(updateUserPasswordDto: UpdateUserPasswordDto) {
        const user = await this.findUserByEmail(updateUserPasswordDto.email);
        
        await this.checkPassword(updateUserPasswordDto.current, user);
        user.password = updateUserPasswordDto.password;
        await user.save();
        return {
            name: user.name,
            email: user.email
        };
    }

    private async isEmailUnique(email: string, userId: string = null) {
        
        let search = {email: email};
        if (userId) {
            search = {... search, ...{ _id: { $ne: userId }}};
        }
        const user = await this.userModel.findOne(search);
        if (user) {
            throw new BadRequestException('Email must be unique!');
        }
    }

    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email: email});
        if (!user) {
          throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }
}