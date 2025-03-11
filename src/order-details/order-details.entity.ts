import { v4 as uuid } from "uuid"
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OrderEntity } from "../orders/order.entity"
import { ProductEntity } from "../products/product.entity"

@Entity({ name: "Order details" })
export class OrderDetailsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid()

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number

  @OneToOne(() => OrderEntity, (order) => order.orderDetails)
  order: OrderEntity

  @ManyToMany(() => ProductEntity, (product) => product.orderDetails)
  @JoinTable({
    name: "order_details_products",
    joinColumn: {
      name: "order_details_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id"
    }
  })
  products: ProductEntity[];
}
