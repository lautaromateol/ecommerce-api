import { Role } from "src/auth/roles.enum";

interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  roles: Role[];
  iat: number;
  exp: number;
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}