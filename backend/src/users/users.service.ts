import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './models/user.model.js';
import { UserRole } from './enums/user-role.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.findAll({
            order: [['id', 'ASC']],
        });
    }

    async findById(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { email },
        });
    }

    async findByEmailWithPassword(
        email: string,
    ): Promise<User | null> {
        return this.userModel.unscoped().findOne({
            where: { email },
        });
    }

    async create(dto: CreateUserDto): Promise<User> {
        const passwordHash = await this.hashPassword(dto.password);

        try {
            const user = await this.userModel.create({
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: dto.role ?? UserRole.USER,
            });

            return this.findById(user.id);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async update(
        id: number,
        dto: UpdateUserDto,
    ): Promise<User> {
        const user = await this.findById(id);

        if (dto.name !== undefined) {
            user.name = dto.name;
        }

        if (dto.email !== undefined) {
            user.email = dto.email;
        }

        if (dto.role !== undefined) {
            user.role = dto.role;
        }

        if (dto.password !== undefined) {
            user.passwordHash = await this.hashPassword(dto.password);
        }

        try {
            await user.save();
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }

        return this.findById(id);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findById(id);

        await user.destroy();
    }

    private async hashPassword(password: string): Promise<string> {
        if (Buffer.byteLength(password, 'utf8') > 72) {
            throw new BadRequestException(
                'Password must not exceed 72 bytes',
            );
        }

        return bcrypt.hash(password, 12);
    }
}