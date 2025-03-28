import { Module } from "@nestjs/common";
import { CloudinaryConfig } from "src/config/cloudinary";
import { CloudinaryService } from "./cloudinary.service";
import { ProductsModule } from "src/products/products.module";

@Module({
  imports: [ProductsModule],
  providers: [CloudinaryService, CloudinaryConfig],
})
export class CloudinaryModule {}