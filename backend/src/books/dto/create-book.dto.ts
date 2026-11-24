import { Transform } from 'class-transformer';
import {
    IsString,
    IsUrl,
    MinLength,
    MaxLength,
} from 'class-validator';

export class CreateBookDto {
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    name!: string;

    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    author!: string;

    @IsString()
    @IsUrl({
        protocols: ['http', 'https'],
        require_protocol: true,
    })
    @MaxLength(2048)
    photo!: string;
}