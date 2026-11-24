import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { User } from '../users/models/user.model.js';
import {RefreshDto} from "./dto/refresh.dto.js";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Body() dto: RefreshDto) {
        return this.authService.refresh(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@CurrentUser() user: User) {
        return user;
    }
}