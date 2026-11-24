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

interface BookCreationAttributes {
    name: string;
    author: string;
    photo: string;
    ownerId: number;
}

@Table({
    tableName: 'books',
    timestamps: true,
})
export class Book extends Model<Book, BookCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    declare author: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare photo: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare ownerId: number;

    @BelongsTo(() => User, {
        onDelete: 'CASCADE',
    })
    declare owner: NonAttribute<User>;
}