/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../auth/dtos/create-user.dto";
import { UserEntity } from "./user.entity";
import { PaginatedUsersResponseDto } from "./dtos/paginated-user-response.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { UpdateUserResponse } from "./dtos/update-user-response.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) { }

  async getUsers(page: number, limit: number): Promise<PaginatedUsersResponseDto> {
    const skip = (page - 1) * limit;

    const users = await this.usersRepository.find({ skip, take: limit, relations: ["orders"] });

    return { 
      users,
      page,
      limit
    }
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email })
  }

  getUser(id: string): Promise<UserResponseDto | null> {
    return this.usersRepository.findOne({ where: { id }, relations: ["orders"] })
  }

  saveUser(user: Omit<CreateUserDto, "confirmPassword">) {
    return this.usersRepository.save(user);
  }

  async updateUser(user: UpdateUserDto, id: string): Promise<UpdateUserResponse> {
    const dbUser = await this.usersRepository.findOne({ where: { id } })

    if (!dbUser) {
      throw new NotFoundException("User not found.")
    }

    for (const prop in user) {
      if (Object.prototype.hasOwnProperty.call(user, prop) && prop !== "id" && user[prop] !== undefined) {
        dbUser[prop] = user[prop]
      }
    }

    try {
      const newUser = await this.usersRepository.save(dbUser)
      return { success: true, user: newUser }
    } catch {
      throw new InternalServerErrorException("There was an error updating the user. Try again later.")
    }
  }

  async deleteUser(id: string) {
    const dbUser = await this.usersRepository.findOne({ where: { id } })

    if (!dbUser) {
      throw new NotFoundException("User not found.")
    }

    try {
      await this.usersRepository.delete(dbUser.id)
      return { success: true, deletedId: dbUser.id }
    } catch {
      throw new InternalServerErrorException("There was an error deleting the user. Try again later.")
    }
  }
}