import { HOME_CONTENT } from "@/lib/content/home";
import { SPACING } from "@/lib/design/tokens";

import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function FinalCTASection() {
  const { title, description, ctaText } = HOME_CONTENT.finalCta;

  return (
    <section
      className={cn("mx-auto max-w-4xl text-center", SPACING.sectionPadding.sm)}
    >
      <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
      <Button href="/contacto" variant="primary" size="md" className="group">
        {ctaText}
        <ArrowRight className="h-5 w-5 transition-all group-hover:translate-x-1 group-hover:scale-110" />
      </Button>
    </section>
  );
}
