import { FC } from "react";
import { Book } from "@prisma/client";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface CurrentlyReadingProps {
  book: Book;
  blurDataUrl?: string;
}

const CurrentlyReading: FC<CurrentlyReadingProps> = ({ book, blurDataUrl }) => {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
        {/* Cover */}
        <div className="flex-shrink-0">
          {book.coverImageUrl ? (
            <div className="relative">
              {/* Soft decorative shadow behind the book */}
              <div className="absolute -inset-3 bg-primary/5 dark:bg-primary/10 rounded-2xl blur-xl" />
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                width={220}
                height={330}
                className="relative rounded-xl shadow-lg object-cover"
                placeholder={blurDataUrl ? "blur" : "empty"}
                blurDataURL={blurDataUrl}
                priority
              />
            </div>
          ) : (
            <div className="w-[220px] h-[330px] bg-muted rounded-xl flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-center text-center md:text-left space-y-4 min-w-0 py-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Currently Reading
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {book.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              {book.author}
            </p>
          </div>

          {book.description && (
            <p className="text-foreground/75 dark:text-foreground/65 leading-relaxed text-[15px] max-w-lg">
              {book.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CurrentlyReading;
