import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

const mockPosts: Record<string, { title: string; date: string; content: string }> = {
  "getting-started-with-nextjs": {
    title: "Getting Started with Next.js",
    date: "2025-03-01",
    content: "Next.js is a React framework for production. This article covers the basics.",
  },
  "intro-to-typescript": {
    title: "Introduction to TypeScript",
    date: "2025-02-15",
    content: "TypeScript adds static typing to JavaScript. Learn the fundamentals.",
  },
  "web-dev-resources": {
    title: "Web Dev Resources",
    date: "2025-02-01",
    content: "Curated list of resources for web development learners.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = mockPosts[slug];
  if (!post) return { title: "Blog — GEEKROOM JIMSEMTC" };
  return {
    title: `${post.title} — GEEKROOM JIMSEMTC`,
    description: post.content.slice(0, 120),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = mockPosts[slug];

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        href="/blog"
        className="inline-flex min-h-[44px] items-center text-sm font-medium text-foreground/70 hover:text-foreground"
      >
        ← Back to Blog
      </Link>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-foreground/70">{post.date}</p>
      <p className="mt-6 text-base text-foreground/80 sm:mt-8 sm:text-lg">{post.content}</p>
    </main>
  );
}
