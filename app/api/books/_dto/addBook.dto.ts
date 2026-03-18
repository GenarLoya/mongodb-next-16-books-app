import { z } from "zod";

export const AddBookDto = z.object({
  title: z.string(),
  author: z.string(),
});

export type TAddBookdTO = z.infer<typeof AddBookDto>;
