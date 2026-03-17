import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import Library from "@/models/Library";
import User from "@/models/User";

async function seed() {
  try {
    await connectDB();
    console.log("🟢 Connected to MongoDB");

    // 🧹 clear collections
    await Promise.all([
      Book.deleteMany({}),
      User.deleteMany({}),
      Library.deleteMany({}),
    ]);

    console.log("🧹 Database cleared");

    // 👤 users
    const users = await User.insertMany([
      { name: "John Doe", email: "john@test.com" },
      { name: "Jane Smith", email: "jane@test.com" },
    ]);

    // 📚 books
    const books = await Book.insertMany([
      { title: "Clean Code", author: "Robert C. Martin" },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt" },
      { title: "Harry Potter", author: "J.K. Rowling" },
      { title: "Don Quixote", author: "Miguel de Cervantes" },
    ]);

    // 🏛️ library
    const library = await Library.create({
      name: "Central Library",
      books: books.map((b) => b._id),
      users: users.map((u) => u._id),
    });

    // 🔄 simulate a loan
    const user = users[0];
    const book = books[0];

    await Book.findByIdAndUpdate(book._id, {
      borrowedBy: user._id,
      isAvailable: false,
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { borrowedBooks: book._id },
    });

    console.log("📚 Seed data inserted successfully");
    console.log("🏛️ Library:", library.name);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
