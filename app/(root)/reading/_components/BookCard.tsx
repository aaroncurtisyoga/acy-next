import { FC } from "react";
import { Book } from "@prisma/client";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface BookCardProps {
  book: Book;
}

const BookCard: FC<BookCardProps> = ({ book }) => {
  return (
    <div className="group">
      {/* Cover */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow duration-200">
        {book.coverImageUrl ? (
          <Image
            src={book.coverImageUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="mt-3 space-y-0.5">
        <h3 className="font-medium text-sm leading-snug line-clamp-2 text-foreground">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;
