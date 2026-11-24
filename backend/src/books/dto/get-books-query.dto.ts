import { Transform, Type } from 'class-transformer';

import {
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class GetBooksQueryDto {
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(150)
    search?: string;

    @IsIn(['ASC', 'DESC'])
    sort: 'ASC' | 'DESC' = 'ASC';

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 12;
}