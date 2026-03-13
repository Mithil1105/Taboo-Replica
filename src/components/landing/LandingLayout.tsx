import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface LandingLayoutProps {
  children: ReactNode;
  className?: string;
}

export function LandingLayout({ children, className }: LandingLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background", className)}>
      <Navbar />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
