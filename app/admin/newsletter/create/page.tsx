"use client";

import { FC } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsletterEditor from "@/app/admin/newsletter/_components/NewsletterEditor";

const CreateNewsletterPage: FC = () => {
  return (
    <div className="wrapper max-w-4xl mx-auto">
      <Link
        href="/admin/newsletter"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Newsletters
      </Link>
      <h1 className="mb-6 font-display text-3xl uppercase text-foreground">
        New Newsletter
      </h1>
      <NewsletterEditor />
    </div>
  );
};

export default CreateNewsletterPage;
