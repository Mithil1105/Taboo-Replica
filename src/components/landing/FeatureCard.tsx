import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  index?: number;
}

export function FeatureCard({ title, description, icon: Icon, className, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          "h-full rounded-2xl border border-border/80 bg-card/80 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20",
          className
        )}
      >
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
