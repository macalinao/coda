import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ExternalLink } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Coda",
    },
    githubUrl: "https://github.com/macalinao/coda",
    links: [
      {
        text: "Documentation",
        url: "/docs",
        active: "nested-url",
      },
      {
        icon: <ExternalLink />,
        text: "Typedocs",
        description: "Full TypeDoc documentation",
        url: "https://coda-typedocs.ianm.com",
      },
    ],
  };
}
