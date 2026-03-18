import { TMongoIdDto } from "@/core/dto/monogId.dto";
import { TEditBookDto } from "../_dto/editBook.dto";
import { NotFoundError } from "@/core/api/apiErrors";
import Book from "@/models/Book";

export async function editBook(params: TMongoIdDto, body: TEditBookDto) {
  const findBook = await Book.findById(params.id);

  if (!findBook) {
    throw new NotFoundError("Book not found");
  }

  findBook.set(body);
  await findBook.save();
  return findBook;
}
