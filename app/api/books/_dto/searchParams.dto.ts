import { z } from "zod";

export const BookSearchParamsDto = z.object({
  q: z.string().optional(),

  library_id: z.string().optional(),
  is_available: z.stringbool().optional(),

  borrowed_by: z.string().optional(),

  author: z.string().optional(),

  created_from: z.coerce.date().optional(),
  created_to: z.coerce.date().optional(),

  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  sort_by: z.enum(["title", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type TBookSearchParamsDto = z.infer<typeof BookSearchParamsDto>;
