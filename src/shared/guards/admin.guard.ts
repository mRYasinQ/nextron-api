import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import CommonMessage from '../constants/common-message';
import { REQUIRE_ADMIN_KEY } from '../decorators/admin-only.decorator';

@Injectable()
class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const contextHandler = context.getHandler();
    const contextClass = context.getClass();

    const requireAdmin = this.reflector.getAllAndOverride<boolean | undefined>(REQUIRE_ADMIN_KEY, [contextHandler, contextClass]);
    if (!requireAdmin) return true;

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    const isAdmin = request.isAdmin;
    if (!isAdmin) throw new ForbiddenException(CommonMessage.ACCESS_DENIED);

    return true;
  }
}

export default AdminGuard;
