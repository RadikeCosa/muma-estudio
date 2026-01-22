import { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { TYPOGRAPHY, COLORS } from "@/lib/design/tokens";

interface AboutSectionProps {
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
}

/**
 * Reusable section component for About page
 * Displays an icon, title, and multiple paragraphs
 * Used for historia and proceso sections
 */
export function AboutSection({ title, icon, paragraphs }: AboutSectionProps) {
  return (
    <section>
      <div className="mb-10 flex items-center gap-4">
        <Icon icon={icon} size="md" animated />
        <h2 className={`${TYPOGRAPHY.heading.section} ${COLORS.foreground}`}>
          {title}
        </h2>
      </div>
      
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={`${TYPOGRAPHY.body.muted} sm:text-lg`}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
