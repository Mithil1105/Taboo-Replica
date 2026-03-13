import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-12 md:mb-16 text-center", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {typeof description === "string" ? description : description}
        </p>
      )}
    </header>
  );
}
