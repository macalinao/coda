import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Coda Documentation</h1>
      <p className="font-medium text-fd-muted-foreground">
        Automated TypeScript client generation for Solana programs
      </p>
      <div className="mt-8">
        <Link
          href="/docs"
          className="rounded-md bg-fd-primary px-4 py-2 text-fd-primary-foreground transition-colors hover:bg-fd-primary/80"
        >
          Read the docs
        </Link>
      </div>
    </main>
  );
}