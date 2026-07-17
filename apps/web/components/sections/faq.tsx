import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@repo/ui/accordion";

const faqs = [
  {
    question: "What is Pendon?",
    answer: "Pendon is an AI-powered thinking workspace designed to help you capture ideas, connect knowledge, and build clarity without the friction of traditional note-taking apps.",
  },
  {
    question: "How is it different from Notion or Obsidian?",
    answer: "Unlike Notion's rigid databases or Obsidian's steep learning curve, Pendon offers a fluid canvas that adapts to your mental model, powered by integrated AI that understands your context.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We prioritize privacy and are building a local-first philosophy to ensure your thoughts remain yours.",
  },
  {
    question: "When will Pendon be available?",
    answer: "We are currently in private beta. Join the waitlist to get early access as we roll out invites over the coming weeks.",
  },
  {
    question: "Will there be a mobile app?",
    answer: "Yes, we are building companion apps for iOS and Android to ensure you can capture thoughts on the go.",
  },
];

export function FAQ() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center font-lora text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-2">
              <AccordionTrigger className="text-base sm:text-lg text-gray-950 font-lora font-medium hover:text-gray-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
