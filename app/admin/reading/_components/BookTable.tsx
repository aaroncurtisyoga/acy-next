"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { Book } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BasicModal from "@/app/_components/BasicModal";
import BookForm from "@/app/admin/reading/_components/BookForm";
import { deleteBook, updateBook } from "@/app/_lib/actions/book.actions";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import { handleError } from "@/app/_lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { BookFormSchema } from "@/app/_lib/schema";

type BookFormInputs = z.infer<typeof BookFormSchema>;

interface BookTableProps {
  books: Book[];
  setBooks: Dispatch<SetStateAction<Book[]>>;
  onBooksChanged: () => void;
}

const BookTable: FC<BookTableProps> = ({ books, setBooks, onBooksChanged }) => {
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleDeleteClick = (book: Book) => {
    setSelectedBook(book);
    deleteModal.onOpen();
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    editModal.onOpen();
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      const result = await deleteBook(selectedBook.id);
      if (result.status) {
        setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
        deleteModal.onOpenChange(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditSubmit = async (data: BookFormInputs) => {
    if (!selectedBook) return;
    try {
      const result = await updateBook(selectedBook.id, {
        ...data,
        coverImageUrl: data.coverImageUrl || undefined,
        description: data.description || undefined,
      });
      if (result.status) {
        editModal.onOpenChange(false);
        onBooksChanged();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const StatusBadge = ({
    isCurrentlyReading,
  }: {
    isCurrentlyReading: boolean;
  }) =>
    isCurrentlyReading ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        Reading Now
      </Badge>
    ) : (
      <Badge variant="secondary">Read</Badge>
    );

  return (
    <>
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3 mt-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex items-center gap-3 p-3 border rounded-lg"
          >
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                width={40}
                height={60}
                className="rounded object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-[40px] h-[60px] bg-muted rounded flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{book.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {book.author}
              </p>
              <div className="mt-1">
                <StatusBadge isCurrentlyReading={book.isCurrentlyReading} />
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => handleEditClick(book)}
                aria-label={`Edit ${book.title}`}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDeleteClick(book)}
                aria-label={`Delete ${book.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block mt-2">
        <Table aria-label="Table for Managing Books">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  {book.coverImageUrl ? (
                    <Image
                      src={book.coverImageUrl}
                      alt={book.title}
                      width={40}
                      height={60}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-[40px] h-[60px] bg-muted rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <StatusBadge isCurrentlyReading={book.isCurrentlyReading} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEditClick(book)}
                      aria-label={`Edit ${book.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(book)}
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation modal */}
      <BasicModal
        onOpenChange={deleteModal.onOpenChange}
        isOpen={deleteModal.isOpen}
        header="Delete Book"
        primaryAction={handleDelete}
        primaryActionLabel="Delete Book"
      >
        <div>
          <p>Are you sure you want to delete this book?</p>
          <p className="font-medium mt-1">{selectedBook?.title}</p>
        </div>
      </BasicModal>

      {/* Edit modal */}
      <Dialog open={editModal.isOpen} onOpenChange={editModal.onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <BookForm
              key={selectedBook.id}
              defaultValues={{
                title: selectedBook.title,
                author: selectedBook.author,
                description: selectedBook.description ?? "",
                coverImageUrl: selectedBook.coverImageUrl ?? "",
                isCurrentlyReading: selectedBook.isCurrentlyReading,
              }}
              onSubmit={handleEditSubmit}
              onCancel={() => editModal.onOpenChange(false)}
              submitLabel="Update Book"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookTable;
