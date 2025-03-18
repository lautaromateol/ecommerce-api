import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { OrderEntity } from "./order.entity";


@Entity({ name: "Cart Item" })
export class CartItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, order => order.cartItems)
  @JoinColumn({ name: "orderId" })
  order: OrderEntity

  @Column()
  orderId: string;
}