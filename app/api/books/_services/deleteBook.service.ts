import { TMongoIdDto } from "@/core/dto/monogId.dto";
import Book from "@/models/Book";

export const deleteBook = async (params: TMongoIdDto) => {
  const deleteBook = await Book.findByIdAndDelete(params.id);
  return deleteBook;
};
