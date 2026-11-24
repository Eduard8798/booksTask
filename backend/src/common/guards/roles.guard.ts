import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { UserRole } from '../../users/enums/user-role.enum.js';

import type { User } from '../../users/models/user.model.js';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<UserRole[]>(
                ROLES_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (!requiredRoles?.length) {
            return true;
        }

        const { user } = context
            .switchToHttp()
            .getRequest<Request & { user?: User }>();

        return Boolean(
            user && requiredRoles.includes(user.role),
        );
    }
}