import { v4 as uuid } from "uuid"
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm"
import { OrderEntity } from "../orders/order.entity";
import { ReviewEntity } from "../reviews/review.entitity";

@Entity({ name: "User" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid()

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ nullable: true })
  phone?: number;

  @Column({ length: 50, nullable: true })
  country?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ length: 50, nullable: true })
  city?: string;

  @Column({ default: false })
  isAdmin: boolean

  @OneToMany(() => OrderEntity, (order) => order.user)
  @JoinTable()
  orders: OrderEntity[]

  @OneToMany(() => ReviewEntity, (review) => review.user)
  @JoinTable()
  reviews: ReviewEntity[]
}