import { z } from "zod";

export const MongoIdDto = z.object({
  id: z.string(),
});

export type TMongoIdDto = z.infer<typeof MongoIdDto>;
