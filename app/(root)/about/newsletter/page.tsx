import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
};
const NewsletterPage = () => {
  return (
    <section className="wrapper bg-white  rounded-md gap-2 flex flex-col">
      <h1 className="text-3xl mb-8">Subscribe to my Newsletter</h1>
      <p className="mb-6">
        Be the first to know about my upcoming workshops, events, and
        long-format classes!
      </p>
      <NewsletterForm />
    </section>
  );
};

export default NewsletterPage;
