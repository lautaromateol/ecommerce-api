/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { Role } from "src/auth/roles.enum";

interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  name: string;
  roles: Role[];
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user?: JwtPayload
}

async function validateHeader(request: Request, jwtService: JwtService): Promise<boolean> {

  const authorization = request.headers["authorization"]

  if (!authorization) {
    throw new UnauthorizedException("No Authorization Header.")
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new UnauthorizedException("Bearer token not found.")
  }

  const token = authorization.split(" ")[1]
  const secret = process.env.JWT_SECRET

  try {
    const payload = await jwtService.verifyAsync(token, { secret })
    payload.iat = new Date(payload.iat * 1000)
    payload.exp = new Date(payload.exp * 1000)
    request.user = payload

    return true
  } catch {
    throw new ForbiddenException("You are not authorized to access to this information.")
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest() as CustomRequest

    return validateHeader(request, this.jwtService)
  }

}