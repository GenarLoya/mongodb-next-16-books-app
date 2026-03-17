import mongoose from "mongoose";

export interface IBook extends mongoose.Document {
  title: string;
  author?: string;
  isAvailable: boolean;
  borrowedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [120, "Title cannot be more than 120 characters"],
    },
    author: {
      type: String,
      maxlength: [80, "Author name too long"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// 🔥 recommended index for search
BookSchema.index({ title: "text", author: "text" });

export default mongoose.models.Book ||
  mongoose.model<IBook>("Book", BookSchema);
