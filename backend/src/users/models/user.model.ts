import {
    Table,
    Model,
    Column,
    DataType,
    HasMany,
} from 'sequelize-typescript';
import type { NonAttribute } from 'sequelize';
import { UserRole } from '../enums/user-role.enum.js';
import {Book} from "../../books/models/book.model.js";

interface UserCreationAttributes {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
}

@Table({
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: ['passwordHash'],
        },
    },
})
export class User extends Model<User, UserCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING(254),
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare passwordHash: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER,
    })
    declare role: UserRole;

    @HasMany(() => Book)
    declare books: NonAttribute<Book[]>;
}