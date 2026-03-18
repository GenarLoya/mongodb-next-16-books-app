import Book, { IBook } from "@/models/Book";
import { TAddBookdTO } from "../_dto/addBook.dto";

export async function addBook(body: TAddBookdTO): Promise<IBook> {
  const book = new Book(body);
  const savedBook = await book.save();

  return savedBook;
}
