import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/content/faqItems";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  /** Allow multiple open at once */
  type?: "single" | "multiple";
}

export function FAQAccordion({
  items,
  className,
  type = "single",
}: FAQAccordionProps) {
  return (
    <Accordion
      type={type}
      className={cn("w-full", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-border/80">
          <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary py-5">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
