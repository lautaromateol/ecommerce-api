/* eslint-disable @typescript-eslint/unbound-method */
import * as bcrypt from "bcrypt"
import { BadRequestException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "../users/users.service"
import { UserEntity } from "../users/user.entity"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "./dtos/create-user.dto"
import { Role } from "./roles.enum"

jest.mock("bcrypt")

describe("AuthService", () => {
  let authService: AuthService
  let usersService: UsersService
  let jwtService: JwtService

  const mockUser: UserEntity = {
    id: "8909f77f-9f64-4449-abfe-73be1388ae49",
    email: "test@email.com",
    name: "Test",
    password: "hashedPassword",
    isAdmin: false,
    orders: []
  }

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      getUserByEmail: jest.fn().mockImplementation(async (email): Promise<UserEntity | null> => {
        return Promise.resolve(email === mockUser.email ? mockUser : null)
      }),
      saveUser: jest.fn().mockImplementation(async (user: Omit<CreateUserDto, "confirmPassword">): Promise<Omit<CreateUserDto, "confirmPassword"> & UserEntity> => {
        return Promise.resolve({ ...user, id: "8909f77f-9f64-4449-abfe-73be1388ae49", isAdmin: false, orders: [] })
      })
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockReturnValue("mockToken")
          }
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it("should be defined", () => {
    expect(authService).toBeDefined()
  })

  it("signUp() should return a BadRequestException if passwords do not match.", async () => {
    await expect(authService.signUp({
      ...mockUser,
      confirmPassword: "Invalid",
    }))
      .rejects.toThrow(BadRequestException)
  })

  it("signUp() should return a BadRequestException if email is already in use.", async () => {
    await expect(authService.signUp({
      ...mockUser,
      confirmPassword: mockUser.password
    }))
      .rejects.toThrow(BadRequestException)
  })

  it("signUp() should hash user password and create a new user in the database", async () => {

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword")

    const newUser = {
      ...mockUser,
      email: "newmail@test.com",
      password: "ValidPassword123!",
      confirmPassword: "ValidPassword123!"
    }

    const { success, user } = await authService.signUp(newUser)

    expect(success).toBeTruthy()
    expect(user).toBeDefined()
    expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10)
    expect(usersService.saveUser).toHaveBeenCalledWith({
      ...newUser,
      password: "hashedPassword"
    })
  })

  it("signIn() should return a BadRequestException if email is invalid.", async () => {
    await expect(authService.signIn({ email: "invalidmail@test.com", password: mockUser.password })).rejects.toThrow(BadRequestException)
  })

  it("signIn() should return a BadRequest exception if password is invalid.", async () => {
    await expect(authService.signIn({ email: mockUser.email, password: "Invalid" })).rejects.toThrow(BadRequestException)
  })

  it("signIn() should return a token and a success property if credentials are correct.", async () => {
    (bcrypt.compare as jest.Mock).mockReturnValue(true)

    const { success, token } = await authService.signIn({ email: mockUser.email, password: mockUser.password })

    expect(success).toBeTruthy()
    expect(token).toEqual("mockToken")
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: mockUser.id,
      id: mockUser.id,
      email: mockUser.email,
      roles: [mockUser.isAdmin ? Role.ADMIN : Role.USER]
    }, { secret: undefined })
  })
})