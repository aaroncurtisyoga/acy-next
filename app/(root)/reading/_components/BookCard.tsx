import { FC } from "react";
import { Book } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface BookCardProps {
  book: Book;
}

const BookCard: FC<BookCardProps> = ({ book }) => {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Cover */}
        <div className="relative aspect-[2/3] w-full bg-muted">
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
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {book.author}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
