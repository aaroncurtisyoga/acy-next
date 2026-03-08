import { FC } from "react";
import { Book } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface CurrentlyReadingProps {
  book: Book;
  blurDataUrl?: string;
}

const CurrentlyReading: FC<CurrentlyReadingProps> = ({ book, blurDataUrl }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Currently Reading
      </h2>
      <Card className="shadow-lg">
        <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
          {/* Cover */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                width={200}
                height={300}
                className="rounded-lg shadow-md object-cover"
                placeholder={blurDataUrl ? "blur" : "empty"}
                blurDataURL={blurDataUrl}
                priority
              />
            ) : (
              <div className="w-[200px] h-[300px] bg-muted rounded-lg flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="text-xl font-bold text-foreground">{book.title}</h3>
            <p className="text-muted-foreground mt-1">{book.author}</p>
            {book.description && (
              <p className="mt-4 text-foreground/80 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CurrentlyReading;
