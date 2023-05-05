import { PartialType } from "@nestjs/mapped-types";
import { BooksDto } from "./books.dto";

export class UpdateBookDto extends PartialType(BooksDto){
}