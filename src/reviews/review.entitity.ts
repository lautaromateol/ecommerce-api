import { v4 as uuid } from "uuid"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "../products/product.entity";
import { UserEntity } from "../users/user.entity";

@Entity({ name: "Review" })
export class ReviewEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({ length: 50 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => ProductEntity, (product) => product.reviews)
  @JoinColumn({ name: "productId" })
  product: ProductEntity;

  @Column()
  productId: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column()
  userId: string;
}