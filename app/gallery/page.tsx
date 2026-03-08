import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — GEEKROOM JIMSEMTC",
  description: "Media gallery from GEEKROOM events and activities.",
};

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Media Gallery</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        Photos and videos from our events and meetups.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-foreground/10"
          />
        ))}
      </div>
    </main>
  );
}
