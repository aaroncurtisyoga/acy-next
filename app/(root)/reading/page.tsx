import { Metadata } from "next";
import {
  getCurrentlyReadingBook,
  getPastReads,
} from "@/app/_lib/actions/book.actions";
import { getBase64 } from "@/app/_lib/utils/base64";
import CurrentlyReading from "@/app/(root)/reading/_components/CurrentlyReading";
import PastReads from "@/app/(root)/reading/_components/PastReads";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "What I'm Reading | Aaron Curtis Yoga",
};

const ReadingPage = async () => {
  const [currentBook, pastBooks] = await Promise.all([
    getCurrentlyReadingBook(),
    getPastReads(),
  ]);

  let blurDataUrl: string | undefined;
  if (currentBook?.coverImageUrl) {
    try {
      blurDataUrl = (await getBase64(currentBook.coverImageUrl)) || undefined;
    } catch {
      // Don't block page render if blur generation fails
    }
  }

  const hasNoBooks = !currentBook && pastBooks.length === 0;

  return (
    <div className="wrapper-width w-full">
      <div className="max-w-4xl mx-auto py-8 md:py-14 space-y-12 md:space-y-16">
        {/* Page header */}
        <header className="text-center space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            What I&apos;m Reading
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Books that shape my practice, teaching, and perspective.
          </p>
        </header>

        {hasNoBooks && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-14 h-14 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-lg font-medium">No books yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}

        {currentBook && (
          <CurrentlyReading book={currentBook} blurDataUrl={blurDataUrl} />
        )}

        <PastReads books={pastBooks} />
      </div>
    </div>
  );
};

export default ReadingPage;
