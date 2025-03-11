import { v4 as uuid } from "uuid"
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OrderDetailsEntity } from "../order-details/order-details.entity"
import { UserEntity } from "../users/user.entity"

@Entity({ name: "Order" })
export class OrderEntity {
  [x: string]: any
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid()

  @Column({ type: "date", default: () => "CURRENT_DATE" })
  date: Date

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user: UserEntity

  @Column({ nullable: true })
  userId: string;

  @OneToOne(() => OrderDetailsEntity, (orderDetails) => orderDetails.order)
  @JoinColumn({ name: "orderDetailsId" })
  orderDetails: OrderDetailsEntity

  @Column({ nullable: true })
  orderDetailsId: string;
}