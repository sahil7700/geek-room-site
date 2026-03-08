import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team — GEEKROOM JIMSEMTC",
  description: "Meet the core team and members of GEEKROOM JIMSEMTC.",
};

export default function TeamPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Core Team & Members</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        The people behind GEEKROOM — dedicated to building and growing our
        tech community.
      </p>
      <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="rounded-lg border border-foreground/10 p-5 sm:p-6"
          >
            <div className="h-24 w-24 rounded-full bg-foreground/10" />
            <h3 className="mt-4 font-semibold">Member {i}</h3>
            <p className="mt-1 text-sm text-foreground/70">Role</p>
            <p className="mt-2 text-sm text-foreground/80">
              Short bio placeholder.
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
