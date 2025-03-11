import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../products/product.entity";
import { ProductsService } from "../products/products.service";
import { UploadProductImageDto } from "../products/upload-product-image.dto";
import { Role } from "../auth/roles.enum";
import { Auth } from "../decorators/auth.decorator";

@Controller("files")
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(ProductEntity)
    private productsService: ProductsService
  ) { }

  @Post("upload-product-image")
  @Auth(Role.ADMIN)
  @UseInterceptors(FileInterceptor("image"))
  async uploadUserImage(
    @Body() { id }: UploadProductImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200_000
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/
          })
        ]
      })
    ) file: Express.Multer.File
  ) {
    const product = await this.productsService.getProduct(id)

    if (!product) {
      throw new BadRequestException("This product does not exist.")
    }

    const uploadedFile = await this.cloudinaryService.uploadImage(file)

    const newProduct = await this.productsService.updateProduct({ imgUrl: uploadedFile.url }, id)

    return {
      success: true,
      message: "Image uploaded successfully.",
      product: newProduct
    }
  }
}