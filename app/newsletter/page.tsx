import NewsletterForm from "@/components/newsletter/NewsletterForm";

const NewsletterPage = () => {
  return (
    <section className="bg-white shadow-lg rounded-md gap-2 flex flex-col p-6 md:p-8">
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
