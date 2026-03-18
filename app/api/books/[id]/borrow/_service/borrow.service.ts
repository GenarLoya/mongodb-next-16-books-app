import mongoose from "mongoose";
import { TMongoIdDto } from "@/core/dto/monogId.dto";
import { TBorrowBook } from "../_dto/borrow.dto";
import User from "@/models/User";
import { ConflictError, NotFoundError } from "@/core/api/apiErrors";
import Book from "@/models/Book";

export const borrowBook = async (body: TBorrowBook, params: TMongoIdDto) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const book = await Book.findOneAndUpdate(
      {
        _id: params.id,
        borrowedBy: null,
      },
      {
        borrowedBy: body.userId,
      },
      {
        new: true,
        session,
      },
    );

    if (!book) {
      throw new ConflictError("Book is already borrowed or not found");
    }

    const user = await User.findByIdAndUpdate(
      body.userId,
      {
        $addToSet: { borrowedBooks: book._id },
      },
      {
        new: true,
        session,
      },
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await session.commitTransaction();

    return {
      book,
      user,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
