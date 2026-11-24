import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';

import { ExchangesService } from './exchanges.service.js';
import { CreateExchangeDto } from './dto/create-exchange.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

import type { User } from '../users/models/user.model.js';

@Controller('exchanges')
@UseGuards(JwtAuthGuard)
export class ExchangesController {
    constructor(
        private readonly exchangesService: ExchangesService,
    ) {}

    @Post()
    create(
        @Body() dto: CreateExchangeDto,
        @CurrentUser() user: User,
    ) {
        return this.exchangesService.create(dto, user.id);
    }

    @Get('sent')
    findSent(@CurrentUser() user: User) {
        return this.exchangesService.findSent(user.id);
    }

    @Get('received')
    findReceived(@CurrentUser() user: User) {
        return this.exchangesService.findReceived(user.id);
    }
}