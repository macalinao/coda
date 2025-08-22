# Coda Documentation

This is the documentation site for Coda, built with [Fumadocs](https://fumadocs.vercel.app) and Next.js.

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## Structure

```
apps/docs/
├── content/          # Documentation content (MDX files)
│   └── docs/        # Main documentation pages
├── src/
│   ├── app/         # Next.js app directory
│   │   ├── (home)/  # Home page layout
│   │   └── docs/    # Documentation layout
│   └── lib/         # Library code
└── scripts/         # Build scripts
```

## Adding Documentation

1. Create MDX files in `content/docs/`
2. Update navigation in `content/docs/meta.json` if needed
3. Run `bun run dev` to preview changes

## Configuration

- **Layout**: Site configuration in `src/lib/layout.shared.tsx`
- **MDX**: MDX processing in `source.config.ts`
- **Styling**: Global styles in `src/app/global.css` (Tailwind v4)

## Technologies

- **Framework**: Next.js 15 with App Router
- **Documentation**: Fumadocs UI
- **Styling**: Tailwind CSS v4
- **MDX**: Fumadocs MDX with Shiki syntax highlighting
- **Package Manager**: Bun

## Using the Cards Component

For better documentation layout, use the `<Cards>` component for link grids:

```mdx
<Cards>
  <Card 
    title="Installation" 
    description="Step-by-step guide to install Coda"
    href="/docs/installation"
  />
  <Card 
    title="Quick Start" 
    description="Generate your first TypeScript client"
    href="/docs/quick-start"
  />
</Cards>
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
- [Coda Repository](https://github.com/macalinao/coda) - main Coda repository

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
