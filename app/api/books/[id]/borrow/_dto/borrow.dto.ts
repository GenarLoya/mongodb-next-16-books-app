import { z } from "zod";

export const BorrowBookDto = z.object({
  userId: z.string(),
});

export type TBorrowBook = z.infer<typeof BorrowBookDto>;
