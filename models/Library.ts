import mongoose from "mongoose";

export interface ILibrary extends mongoose.Document {
  name: string;
  books: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const LibrarySchema = new mongoose.Schema<ILibrary>(
  {
    name: {
      type: String,
      required: [true, "Please provide a library name"],
      maxlength: [100, "Library name too long"],
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Library ||
  mongoose.model<ILibrary>("Library", LibrarySchema);
