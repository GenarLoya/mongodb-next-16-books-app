import "@/models";

import { BookSearchParamsDto } from "./_dto/searchParams.dto";
import { searchByFilters } from "./_services/searchByFilters.service";
import { withWrapper } from "@/core/api/apiWrapper";
import { AddBookDto } from "./_dto/addBook.dto";
import { addBook } from "./_services/addBook.service";

export const GET = withWrapper(
  { querySchema: BookSearchParamsDto },
  async ({ query }) => {
    const booksSearch = await searchByFilters(query);
    return Response.json(booksSearch);
  },
);

export const POST = withWrapper(
  { bodySchema: AddBookDto },
  async ({ body }) => {
    const newBook = await addBook(body);
    return Response.json(newBook, { status: 201 });
  },
);
