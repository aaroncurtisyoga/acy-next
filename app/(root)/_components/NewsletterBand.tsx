import NewsletterForm from "@/app/_components/NewsletterForm";

export default function NewsletterBand() {
  return (
    <section
      id="newsletter"
      data-testid="newsletter-band"
      className="scroll-mt-20 border-t border-[#dee3f2] bg-band py-14 md:py-20"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-12">
        <div className="h-1.5 w-9 bg-primary" aria-hidden="true" />
        <h2 className="mt-4 font-display text-4xl uppercase text-foreground md:text-5xl">
          Stay in Touch
        </h2>
        <p className="mt-3 max-w-[52ch] text-base font-medium text-[#3c3f4c] md:text-[17px]">
          One short email a month ~ what I&rsquo;m teaching, where to find me,
          and one small thing to take onto the mat. That&rsquo;s it.
        </p>
        <div className="mt-7 max-w-xl">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
