import * as bcrypt from "bcrypt"
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUserDto } from "./dtos/sign-in-user.dto";
import { Role } from "./roles.enum";
import { SignUpResponseDto } from "./dtos/sign-up-response.dto";
import { SignInResponseDto } from "./dtos/sign-in-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signUp(user: CreateUserDto): Promise<SignUpResponseDto> {
    if (user.password !== user.confirmPassword) {
      throw new BadRequestException("Passwords do not match.")
    }

    const dbUser = await this.usersService.getUserByEmail(user.email)

    if (dbUser) {
      throw new BadRequestException("This email is already in use.")
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    const newUser = await this.usersService.saveUser({ ...user, password: hashedPassword })

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        address: newUser.address,
        city: newUser.city,
        country: newUser.country,
        phone: newUser.phone
      }
    }
  }

  async signIn(user: LoginUserDto): Promise<SignInResponseDto> {
    const dbUser = await this.usersService.getUserByEmail(user.email)

    if (!dbUser) {
      throw new BadRequestException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(user.password, dbUser.password)

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid credentials")
    }

    const payload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      roles: [dbUser.isAdmin ? Role.ADMIN : Role.USER]
    }

    const secret = process.env.JWT_SECRET

    const token = await this.jwtService.signAsync(payload, { secret })

    return { success: true, token }
  }

}