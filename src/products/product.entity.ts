import { v4 as uuid } from "uuid"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "../categories/category.entity";

@Entity({ name: "Product" })
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid()

  @Column({ length: 50 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  description: string;
  
  @Column({ length: 50 })
  slug: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number

  @Column()
  stock: number

  @Column({ type: "varchar", length: 255, default: "http://bit.ly/43lkgUe" })
  imgUrl: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: CategoryEntity

  @Column({ nullable: true })
  categoryId: string;
}
