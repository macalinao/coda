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
docs/
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

- **Layout**: Site configuration in `src/app/layout.config.tsx`
- **MDX**: MDX processing in `source.config.ts`
- **Styling**: Global styles in `src/app/global.css` (Tailwind v4)

## Technologies

- **Framework**: Next.js 15 with App Router
- **Documentation**: Fumadocs UI
- **Styling**: Tailwind CSS v4
- **MDX**: Fumadocs MDX with Shiki syntax highlighting
- **Package Manager**: Bun