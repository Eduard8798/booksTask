import { Transform } from 'class-transformer';

import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength, ValidateIf,
} from 'class-validator';

import { UserRole } from '../enums/user-role.enum.js';

export class CreateUserDto {
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;

    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().toLowerCase()
            : value,
    )
    @IsEmail()
    @MaxLength(254)
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password!: string;

    @ValidateIf((_object, value) => value !== undefined)
    @IsEnum(UserRole)
    role?: UserRole;
}