import { v4 as uuid } from "uuid"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "../products/product.entity";

@Entity({ name: "Category" })
export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid()

  @Column({ length: 50 })
  name: string

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[]
}