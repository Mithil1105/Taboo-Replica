import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  /** Optional id for anchor links */
  id?: string;
  /** Optional wrapper (e.g. for alternating background) */
  wrapperClassName?: string;
}

export function SectionContainer({
  children,
  className,
  id,
  wrapperClassName,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", wrapperClassName)}
    >
      <div className={cn("container mx-auto max-w-5xl px-4 sm:px-6", className)}>
        {children}
      </div>
    </section>
  );
}
