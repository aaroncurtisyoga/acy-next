import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqInfo } from "@/constants";

export default function Page() {
  return (
    <section className={"wrapper flex flex-col p-8"}>
      <h1 className={"text-3xl mb-8"}>FAQ</h1>
      <Accordion type="single">
        {faqInfo.map((faq, index) => {
          return (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className={"text-lg md:text-xl text-left"}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className={"md:text-lg"}>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
