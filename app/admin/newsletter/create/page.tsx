"use client";

import { FC } from "react";
import NewsletterEditor from "@/app/admin/newsletter/_components/NewsletterEditor";

const CreateNewsletterPage: FC = () => {
  return (
    <div className="wrapper max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        New Newsletter
      </h1>
      <NewsletterEditor />
    </div>
  );
};

export default CreateNewsletterPage;
