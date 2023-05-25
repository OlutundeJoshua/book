import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProfileDto {

  @IsNumber()
  @IsNotEmpty()
  id:number

  @IsString()
  @IsNotEmpty()
  gender: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string

  @IsNumber()
  @IsNotEmpty()
  age: number
}
