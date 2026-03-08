"use client";

import { FC, useEffect, useState } from "react";
import { Book } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, X } from "lucide-react";
import { getAllBooks, createBook } from "@/app/_lib/actions/book.actions";
import { handleError } from "@/app/_lib/utils";
import { OpenLibrarySearchResult } from "@/app/_lib/types";
import { z } from "zod";
import { BookFormSchema } from "@/app/_lib/schema";
import BookSearch from "@/app/admin/reading/_components/BookSearch";
import BookForm from "@/app/admin/reading/_components/BookForm";
import BookTable from "@/app/admin/reading/_components/BookTable";

type BookFormInputs = z.infer<typeof BookFormSchema>;

type AddStep = "idle" | "search" | "form";

const AdminReading: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [addStep, setAddStep] = useState<AddStep>("idle");
  const [formDefaults, setFormDefaults] = useState<BookFormInputs | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const fetchBooks = async () => {
    const data = await getAllBooks();
    setBooks(data);
  };

  useEffect(() => {
    const loadBooks = async () => {
      const data = await getAllBooks();
      setBooks(data);
    };
    loadBooks();
  }, []);

  const handleSearchSelect = (
    result: OpenLibrarySearchResult,
    description: string | null,
  ) => {
    setFormDefaults({
      title: result.title,
      author: result.author,
      description: description ?? "",
      coverImageUrl: result.coverImageUrl ?? "",
      isCurrentlyReading: false,
    });
    setSelectedKey(result.openLibraryKey);
    setAddStep("form");
  };

  const handleCreateSubmit = async (data: BookFormInputs) => {
    try {
      const result = await createBook({
        ...data,
        coverImageUrl: data.coverImageUrl || undefined,
        description: data.description || undefined,
        openLibraryKey: selectedKey,
      });
      if (result.status) {
        await fetchBooks();
        setAddStep("idle");
        setFormDefaults(null);
        setSelectedKey(undefined);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    setAddStep("idle");
    setFormDefaults(null);
    setSelectedKey(undefined);
  };

  return (
    <div className="wrapper max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reading List</h1>
        <Badge className="bg-primary/10 text-primary text-sm px-3 py-1">
          {books.length} {books.length === 1 ? "Book" : "Books"}
        </Badge>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col gap-3 space-y-0">
          {addStep === "idle" && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <p className="text-lg font-semibold">Manage Books</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setAddStep("search")}
                className="font-medium"
              >
                <Plus className="w-4 h-4" /> Add Book
              </Button>
            </div>
          )}

          {addStep === "search" && (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Search for a Book</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <BookSearch onSelect={handleSearchSelect} />
            </div>
          )}

          {addStep === "form" && formDefaults && (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Add New Book</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <BookForm
                defaultValues={formDefaults}
                onSubmit={handleCreateSubmit}
                onCancel={handleCancel}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-2">
          {books.length > 0 ? (
            <BookTable
              books={books}
              setBooks={setBooks}
              onBooksChanged={fetchBooks}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
              <p>No books yet. Add your first book to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReading;
