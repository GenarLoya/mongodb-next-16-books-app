import { withWrapper } from "@/core/api/apiWrapper";
import { EditBookDto } from "../_dto/editBook.dto";
import { MongoIdDto } from "@/core/dto/monogId.dto";
import { editBook } from "../_services/editBook.service";
import { deleteBook } from "../_services/deleteBook.service";

export const PATCH = withWrapper(
  { bodySchema: EditBookDto, paramsSchema: MongoIdDto },
  async ({ body, params }) => {
    const updatedBook = await editBook(params, body);
    return Response.json(updatedBook, { status: 201 });
  },
);

export const DELETE = withWrapper(
  { paramsSchema: MongoIdDto },
  async ({ params }) => {
    const deletedBook = await deleteBook(params);
    return Response.json(deletedBook);
  },
);
