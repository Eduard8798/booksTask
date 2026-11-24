import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service.js';
import { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('jwt.secret'),
        });
    }

    async validate(payload: JwtPayload) {
        try {
            return await this.usersService.findById(payload.sub);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new UnauthorizedException('User not found');
            }

            throw error;
        }
    }
}