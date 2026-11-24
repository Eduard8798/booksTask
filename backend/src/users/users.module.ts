import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './models/user.model.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard.js";
import {RolesGuard} from "../common/guards/roles.guard.js";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}