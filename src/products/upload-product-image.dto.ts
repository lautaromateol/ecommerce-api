import { IsNotEmpty, IsUUID } from "class-validator";

export class UploadProductImageDto {
  @IsUUID("4")
  @IsNotEmpty()
  id: string;
}