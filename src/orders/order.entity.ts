import { v4 as uuid } from "uuid"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "../users/user.entity"
import { CartItemEntity } from "./cart-item.entity";

@Entity({ name: "Order" })
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid()

  @Column()
  chargeId: string;

  @Column()
  payment_intent: string;

  @Column()
  receipt_url: string;

  @Column()
  refunded: boolean;

  @Column()
  status: string;

  @Column()
  amount_captured: number;

  @Column()
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user: UserEntity

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => CartItemEntity, cartItem => cartItem.order)
  cartItems: CartItemEntity[];
}