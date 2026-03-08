import { FC } from "react";
import { Book } from "@prisma/client";
import BookCard from "@/app/(root)/reading/_components/BookCard";

interface PastReadsProps {
  books: Book[];
}

const PastReads: FC<PastReadsProps> = ({ books }) => {
  if (books.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Previously Read
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default PastReads;
