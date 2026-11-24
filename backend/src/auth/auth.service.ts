import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/enums/user-role.enum.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';

import { JwtPayload } from './types/jwt-payload.type.js';
import { AuthTokens } from './types/auth-tokens.type.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto): Promise<AuthTokens> {
        const user = await this.usersService.create({
            ...dto,
            role: UserRole.USER,
        });

        return this.generateTokens(user.id);
    }

    async login(dto: LoginDto): Promise<AuthTokens> {
        const user =
            await this.usersService.findByEmailWithPassword(dto.email);

        if (!user || Buffer.byteLength(dto.password, 'utf8') > 72) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.generateTokens(user.id);
    }

    async refresh(dto: RefreshDto): Promise<AuthTokens> {
        let payload: JwtPayload;

        try {
            payload = await this.jwtService.verifyAsync<JwtPayload>(
                dto.refreshToken,
                {
                    secret: this.configService.getOrThrow<string>(
                        'jwt.refreshSecret',
                    ),
                    algorithms: ['HS256'],
                },
            );
        } catch {
            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }

        if (!Number.isInteger(payload.sub) || payload.sub <= 0) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        try {
            await this.usersService.findById(payload.sub);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new UnauthorizedException('User not found');
            }

            throw error;
        }

        return this.generateTokens(payload.sub);
    }

    private async generateTokens(
        userId: number,
    ): Promise<AuthTokens> {
        const payload: JwtPayload = {
            sub: userId,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>(
                    'jwt.secret',
                ),
                expiresIn: '45m',
            }),

            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>(
                    'jwt.refreshSecret',
                ),
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}