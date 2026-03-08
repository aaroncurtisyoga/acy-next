import { FC } from "react";
import { Book } from "@prisma/client";
import BookCard from "@/app/(root)/reading/_components/BookCard";

interface PastReadsProps {
  books: Book[];
}

const PastReads: FC<PastReadsProps> = ({ books }) => {
  if (books.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Separator */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-serif text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
          Previously Read
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default PastReads;
