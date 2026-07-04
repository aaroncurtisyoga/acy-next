"use client";

import { FC } from "react";
import NewsletterEditor from "@/app/admin/newsletter/_components/NewsletterEditor";

const CreateNewsletterPage: FC = () => {
  return (
    <div className="wrapper max-w-4xl mx-auto">
      <h1 className="mb-6 font-display text-3xl uppercase text-foreground">
        New Newsletter
      </h1>
      <NewsletterEditor />
    </div>
  );
};

export default CreateNewsletterPage;
