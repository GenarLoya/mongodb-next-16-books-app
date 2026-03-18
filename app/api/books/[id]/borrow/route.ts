import { withWrapper } from "@/core/api/apiWrapper";
import { BorrowBookDto } from "./_dto/borrow.dto";
import { MongoIdDto } from "@/core/dto/monogId.dto";
import { borrowBook } from "./_service/borrow.service";

export const POST = withWrapper(
  { bodySchema: BorrowBookDto, paramsSchema: MongoIdDto },
  async ({ body, params }) => {
    const result = await borrowBook(body, params);
    return Response.json(result, { status: 201 });
  },
);
