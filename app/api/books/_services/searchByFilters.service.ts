import { IUser } from "@/models";
import Book from "@/models/Book";
import { QueryFilter } from "mongoose";
import { TBookSearchParamsDto } from "../_dto/searchParams.dto";

export async function searchByFilters(params: TBookSearchParamsDto) {
  const query: QueryFilter<TBookSearchParamsDto> = {};

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

  return {
    success: true,
    data: books,
    meta: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
