import {
    Body,
    Controller,
    Delete, ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserRole } from './enums/user-role.enum.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import {CurrentUser} from "../common/decorators/current-user.decorator.js";
import {User} from "./models/user.model.js";

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
        @CurrentUser() currentUser: User,
    ) {
        if (
            id === currentUser.id &&
            dto.role !== undefined &&
            dto.role !== currentUser.role
        ) {
            throw new ForbiddenException(
                'You cannot change your own role',
            );
        }

        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: User,
    ) {
        if (id === currentUser.id) {
            throw new ForbiddenException(
                'You cannot delete your own account',
            );
        }

        await this.usersService.remove(id);
    }
}