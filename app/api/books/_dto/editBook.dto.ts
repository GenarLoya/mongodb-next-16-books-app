import z from "zod";
import { AddBookDto } from "./addBook.dto";

export const EditBookDto = AddBookDto.partial();

export type TEditBookDto = z.infer<typeof EditBookDto>;
