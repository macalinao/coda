import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Coda
          </h1>
          <p className="mb-8 text-xl text-fd-muted-foreground sm:text-2xl">
            Automated TypeScript client generation for Solana programs
          </p>
          
          {/* Terminal Mockup */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card shadow-xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-2 text-xs text-fd-muted-foreground">Terminal</span>
              </div>
              
              {/* Terminal Content */}
              <div className="bg-black p-6 font-mono text-sm">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="mr-2 text-green-400">$</span>
                    <span className="text-white">coda generate</span>
                  </div>
                  <div className="text-fd-muted-foreground">
                    <div className="ml-4">
                      <div>✓ Found IDL at ./idls/my_program.json</div>
                      <div>✓ Parsing Anchor IDL...</div>
                      <div>✓ Building AST from 12 instructions</div>
                      <div>✓ Applying visitor transformations</div>
                      <div>✓ Generating TypeScript client...</div>
                      <div className="mt-2 text-green-400">
                        ✓ Client generated successfully at ./src/generated
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <div className="flex items-start">
                      <span className="mr-2 text-green-400">$</span>
                      <span className="text-white">ls ./src/generated</span>
                    </div>
                    <div className="ml-4 mt-1 grid grid-cols-2 gap-x-4 text-blue-400">
                      <div>accounts/</div>
                      <div>instructions/</div>
                      <div>errors/</div>
                      <div>pdas/</div>
                      <div>types/</div>
                      <div>index.ts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-12 grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-fd-border bg-fd-card p-4">
              <h3 className="mb-2 font-semibold">Zero Configuration</h3>
              <p className="text-sm text-fd-muted-foreground">
                Works out of the box with standard Anchor projects. No setup required.
              </p>
            </div>
            <div className="rounded-lg border border-fd-border bg-fd-card p-4">
              <h3 className="mb-2 font-semibold">Type Safety</h3>
              <p className="text-sm text-fd-muted-foreground">
                Full TypeScript types for every instruction, account, and error.
              </p>
            </div>
            <div className="rounded-lg border border-fd-border bg-fd-card p-4">
              <h3 className="mb-2 font-semibold">Automatic Sync</h3>
              <p className="text-sm text-fd-muted-foreground">
                Regenerate anytime your IDL changes. Client stays in perfect sync.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex items-center rounded-md bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              Get Started
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="https://github.com/macalinao/coda"
              className="inline-flex items-center rounded-md border border-fd-border bg-fd-background px-6 py-3 font-medium transition-colors hover:bg-fd-muted"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Example Section */}
      <section className="border-t border-fd-border bg-fd-muted/20 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold">
            From IDL to TypeScript in Seconds
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Before */}
            <div>
              <h3 className="mb-4 font-semibold text-fd-muted-foreground">Your Anchor IDL</h3>
              <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card">
                <pre className="overflow-x-auto p-4 text-xs">
                  <code>{`{
  "instructions": [{
    "name": "transfer",
    "accounts": [
      { "name": "source", "isMut": true },
      { "name": "destination", "isMut": true },
      { "name": "authority", "isSigner": true }
    ],
    "args": [
      { "name": "amount", "type": "u64" }
    ]
  }]
}`}</code>
                </pre>
              </div>
            </div>
            
            {/* After */}
            <div>
              <h3 className="mb-4 font-semibold text-fd-muted-foreground">Generated TypeScript</h3>
              <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card">
                <pre className="overflow-x-auto p-4 text-xs">
                  <code>{`import { createTransferInstruction } from "./generated";

const instruction = createTransferInstruction({
  source: sourceAccount,
  destination: destAccount,
  authority: signer,
  amount: 1000n
});

// Full type safety and autocomplete ✨`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
