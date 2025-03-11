/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/auth/roles.enum";

interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  roles: Role[];
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user?: JwtPayload
}

function matchRoles(roles: Role[], userRoles: Role[]): boolean {
  return roles.some((role) => userRoles.includes(role))
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass()
    ])

    if(!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest() as CustomRequest
    const user = request.user

    if(!user || !user.roles) {
      throw new ForbiddenException("Forbidden resource.")
    }

    return matchRoles(roles, user.roles as Role[])
  }
  
}