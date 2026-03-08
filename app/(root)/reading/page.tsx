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
    <div className="wrapper max-w-5xl mx-auto py-8 w-full space-y-10">
      <h1 className="text-4xl font-bold text-foreground">
        What I&apos;m Reading
      </h1>

      {hasNoBooks && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-lg">No books yet. Check back soon!</p>
        </div>
      )}

      {currentBook && (
        <CurrentlyReading book={currentBook} blurDataUrl={blurDataUrl} />
      )}

      <PastReads books={pastBooks} />
    </div>
  );
};

export default ReadingPage;
