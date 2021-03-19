import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
// import { VerifyUuidDto } from './dto/verify-uuid.dto';
// import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
// import { ForgotPassword } from './interfaces/forgot-password.interface';
import { User } from './interfaces/users.interface';

@Injectable()
export class UsersService {

    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        // @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
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
        const user = await this.userModel.findByIdAndUpdate(id, data);
        // await this.isEmailUnique(user.email);
        return user;
    }

    async login(loginUserDto: LoginUserDto) {
        console.log(loginUserDto);
        const user = await this.findUserByEmail(loginUserDto.email);
        console.log(user);
        await this.checkPassword(loginUserDto.password, user);
        return {
            name: user.name,
            email: user.email,
            token: await this.authService.createAccessToken(user._id)
        };
    }

    // async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    //     const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
    //     const user = await this.userModel.findById(userId);
    //     if (!user) {
    //         throw new BadRequestException('Bad request');
    //     }
    //     return {
    //         accessToken: await this.authService.createAccessToken(user._id),
    //     };
    // }

    // async forgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
    //     await this.findByEmail(createForgotPasswordDto.email);
    //     await this.saveForgotPassword(req, createForgotPasswordDto);
    //     return {
    //         email: createForgotPasswordDto.email,
    //         message: 'verification sent.',
    //     };
    // }

    // async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto) {
    //     const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
    //     await this.setForgotPasswordFirstUsed(req, forgotPassword);
    //     return {
    //         email: forgotPassword.email,
    //         message: 'now reset your password.',
    //     };
    // }

    // async resetPassword(resetPasswordDto: ResetPasswordDto) {
    //     const forgotPassword = await this.findForgotPasswordByEmail(resetPasswordDto);
    //     await this.setForgotPasswordFinalUsed(forgotPassword);
    //     await this.resetUserPassword(resetPasswordDto);
    //     return {
    //         email: resetPasswordDto.email,
    //         message: 'password successfully changed.',
    //     };
    // }

    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({email, verified: true});
        if (user) {
            throw new BadRequestException('Email most be unique.');
        }
    }

    private buildRegistrationInfo(user): any {
        const userRegistrationInfo = {
            fullName: user.fullName,
            email: user.email,
            verified: user.verified,
        };
        return userRegistrationInfo;
    }

    private async findByVerification(verification: string): Promise<User> {
        const user = await this.userModel.findOne({verification, verified: false, verificationExpires: {$gt: new Date()}});
        if (!user) {
            throw new BadRequestException('Bad request.');
        }
        return user;
    }

    private async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email, verified: true});
        if (!user) {
            throw new NotFoundException('Email not found.');
        }
        return user;
    }

    private async setUserAsVerified(user) {
        user.verified = true;
        await user.save();
    }

    private async findUserByEmail(email: string): Promise<User> {
        console.log(email);
        const user = await this.userModel.findOne({email: email});
        console.log(user);
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


    // private async saveForgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
    //     const forgotPassword = await this.forgotPasswordModel.create({
    //         email: createForgotPasswordDto.email,
    //         verification: v4(),
    //         expires: addHours(new Date(), this.HOURS_TO_VERIFY),
    //         ip: this.authService.getIp(req),
    //         browser: this.authService.getBrowserInfo(req),
    //         country: this.authService.getCountry(req),
    //     });
    //     await forgotPassword.save();
    // }

    // private async findForgotPasswordByUuid(verifyUuidDto: VerifyUuidDto): Promise<ForgotPassword> {
    //     const forgotPassword = await this.forgotPasswordModel.findOne({
    //         verification: verifyUuidDto.verification,
    //         firstUsed: false,
    //         finalUsed: false,
    //         expires: {$gt: new Date()},
    //     });
    //     if (!forgotPassword) {
    //         throw new BadRequestException('Bad request.');
    //     }
    //     return forgotPassword;
    // }

    // private async setForgotPasswordFirstUsed(req: Request, forgotPassword: ForgotPassword) {
    //     forgotPassword.firstUsed = true;
    //     forgotPassword.ipChanged = this.authService.getIp(req);
    //     forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
    //     forgotPassword.countryChanged = this.authService.getCountry(req);
    //     await forgotPassword.save();
    // }

    // private async findForgotPasswordByEmail(resetPasswordDto: ResetPasswordDto): Promise<ForgotPassword> {
    //     const forgotPassword = await this.forgotPasswordModel.findOne({
    //         email: resetPasswordDto.email,
    //         firstUsed: true,
    //         finalUsed: false,
    //         expires: {$gt: new Date()},
    //     });
    //     if (!forgotPassword) {
    //         throw new BadRequestException('Bad request.');
    //     }
    //     return forgotPassword;
    // }

    // private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
    //     forgotPassword.finalUsed = true;
    //     await forgotPassword.save();
    // }

    // private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    //     const user = await this.userModel.findOne({
    //         email: resetPasswordDto.email,
    //         verified: true,
    //     });
    //     user.password = resetPasswordDto.password;
    //     await user.save();
    // }
}