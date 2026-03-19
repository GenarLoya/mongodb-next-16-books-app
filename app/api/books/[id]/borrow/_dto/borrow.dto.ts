import { z } from "zod";

export const BorrowBookDto = z.object({
  userId: z.string().min(1),
});

export type TBorrowBook = z.infer<typeof BorrowBookDto>;
