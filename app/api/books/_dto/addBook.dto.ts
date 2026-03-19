import { z } from "zod";

export const AddBookDto = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
});

export type TAddBookdTO = z.infer<typeof AddBookDto>;
