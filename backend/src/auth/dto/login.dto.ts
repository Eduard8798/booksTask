import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MaxLength,
} from 'class-validator';

export class LoginDto {
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().toLowerCase()
            : value,
    )
    @IsEmail()
    @MaxLength(254)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(72)
    password!: string;
}