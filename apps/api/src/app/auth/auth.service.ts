import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';

import * as Cryptr from 'cryptr';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class AuthService {

  cryptr: any;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {
    this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET || 'test');
  }

  async createAccessToken(userId: string) {
    const accessToken = sign({userId}, process.env.JWT_SECRET || 'test' , { expiresIn: process.env.JWT_EXPIRATION || '5d'});
    return this.encryptText(accessToken);
  }

  async validateUser(jwtPayload: JwtPayload): Promise<any> {
    const user = await this.userModel.findOne({_id: jwtPayload.userId, verified: true});
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  private jwtExtractor(request) {
    let token = null;
    if (request.header('x-token')) {
    token = request.get('x-token');
  } else if (request.headers.authorization) {
    token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
  } else if (request.body.token) {
    token = request.body.token.replace(' ', '');
  }
    if (request.query.token) {
    token = request.body.token.replace(' ', '');
  }
    const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    if (token) {
      try {
        token = cryptr.decrypt(token);
      } catch (err) {
        throw new BadRequestException('Bad request.');
      }
  }
    return token;
}

  returnJwtExtractor() {
    return this.jwtExtractor;
  }

  encryptText(text: string): string {
    return this.cryptr.encrypt(text);
  }
}