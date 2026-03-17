import "@/models";

import { connectDB } from "@/lib/mongodb";
import { ZodError, z } from "zod";
import { QueryFilter } from "mongoose";
import Book, { IBook as BookType } from "@/models/Book";
import { BookSearchParamsDto } from "./_dto/searchParams";
import { IUser } from "@/models";

type BookSearchParams = z.infer<typeof BookSearchParamsDto>;

export async function GET(req: Request) {
  try {
    const rawSearchParams = Object.fromEntries(
      new URL(req.url).searchParams.entries(),
    );

    await connectDB();

    const params: BookSearchParams = BookSearchParamsDto.parse(rawSearchParams);

    const query: QueryFilter<BookType> = {};

    // filters
    if (params.is_available !== undefined) {
      query.isAvailable = params.is_available;
    }

    if (params.borrowed_by) {
      query.borrowedBy = params.borrowed_by;
    }

    if (params.author) {
      query.author = { $regex: params.author, $options: "i" };
    }

    if (params.q) {
      query.$or = [
        { title: { $regex: params.q, $options: "i" } },
        { author: { $regex: params.q, $options: "i" } },
      ];
    }

    if (params.created_from || params.created_to) {
      query.createdAt = {
        ...(params.created_from && { $gte: params.created_from }),
        ...(params.created_to && { $lte: params.created_to }),
      };
    }

    // pagination
    const skip = (params.page - 1) * params.limit;

    // sorting
    const sort: Record<string, 1 | -1> = {
      [params.sort_by]: params.order === "asc" ? 1 : -1,
    };

    // queries
    const [books, total] = await Promise.all([
      Book.find(query)
        .populate<{
          borrowedBy: IUser;
        }>("borrowedBy")
        .sort(sort)
        .skip(skip)
        .limit(params.limit)
        .lean(),

      Book.countDocuments(query),
    ]);

    return Response.json({
      success: true,
      data: books,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error: unknown) {
    console.error(error);

    // ❌ validation error
    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: error.issues,
        },
        { status: 400 },
      );
    }

    // ❌ unknown error
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
