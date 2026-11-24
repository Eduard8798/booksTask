import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import type { NonAttribute } from 'sequelize';

import { User } from '../../users/models/user.model.js';
import { Book } from '../../books/models/book.model.js';

interface OfferedBook {
    id: number;
    name: string;
    author: string;
}

interface ExchangeRequestCreationAttributes {
    senderId: number;
    recipientId: number;
    bookId: number;
    offeredBooks: OfferedBook[];
}

@Table({
    tableName: 'exchange_requests',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['senderId', 'bookId'],
        },
    ],
})
export class ExchangeRequest extends Model<
    ExchangeRequest,
    ExchangeRequestCreationAttributes
> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare senderId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare recipientId: number;

    @ForeignKey(() => Book)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare bookId: number;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    declare offeredBooks: OfferedBook[];

    @BelongsTo(() => User, {
        foreignKey: 'senderId',
        onDelete: 'CASCADE',
    })
    declare sender: NonAttribute<User>;

    @BelongsTo(() => User, {
        foreignKey: 'recipientId',
        onDelete: 'CASCADE',
    })
    declare recipient: NonAttribute<User>;

    @BelongsTo(() => Book, {
        foreignKey: 'bookId',
        onDelete: 'CASCADE',
    })
    declare book: NonAttribute<Book>;
}