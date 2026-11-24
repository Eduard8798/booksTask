import { IsInt, Min } from 'class-validator';

export class CreateExchangeDto {
    @IsInt()
    @Min(1)
    bookId!: number;
}