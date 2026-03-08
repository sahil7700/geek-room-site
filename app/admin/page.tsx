import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — GEEKROOM JIMSEMTC",
  description: "Private dashboard for content management.",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4">
        Private content management dashboard. Integrate with Supabase for
        managing events, blog posts, team members, and more.
      </p>
      <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
        <div className="rounded-lg border border-foreground/10 p-5 sm:p-6">
          <h3 className="font-semibold">Events</h3>
          <p className="mt-1 text-sm text-foreground/70">Manage events and workshops.</p>
        </div>
        <div className="rounded-lg border border-foreground/10 p-5 sm:p-6">
          <h3 className="font-semibold">Blog</h3>
          <p className="mt-1 text-sm text-foreground/70">Create and edit articles.</p>
        </div>
        <div className="rounded-lg border border-foreground/10 p-5 sm:p-6">
          <h3 className="font-semibold">Team</h3>
          <p className="mt-1 text-sm text-foreground/70">Update team members.</p>
        </div>
        <div className="rounded-lg border border-foreground/10 p-5 sm:p-6">
          <h3 className="font-semibold">Gallery</h3>
          <p className="mt-1 text-sm text-foreground/70">Upload and manage media.</p>
        </div>
      </div>
    </main>
  );
}
