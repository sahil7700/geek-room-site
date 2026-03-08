import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — GEEKROOM JIMSEMTC",
  description: "Articles and resources from GEEKROOM JIMSEMTC.",
};

const mockPosts = [
  { slug: "getting-started-with-nextjs", title: "Getting Started with Next.js", date: "2025-03-01" },
  { slug: "intro-to-typescript", title: "Introduction to TypeScript", date: "2025-02-15" },
  { slug: "web-dev-resources", title: "Web Dev Resources", date: "2025-02-01" },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Articles & Resources</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        Tutorials, insights, and resources from the GEEKROOM community.
      </p>
      <ul className="mt-8 space-y-4 sm:mt-12 sm:space-y-6">
        {mockPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block min-h-[48px] rounded-lg border border-foreground/10 p-4 transition active:bg-foreground/5 hover:border-foreground/20"
            >
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-foreground/70">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
