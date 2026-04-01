import type { Metadata } from "next";
import { getSettings } from "@/app/actions/settings";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join Us — GEEKROOM JIMSEMTC",
  description: "Join GEEKROOM JIMSEMTC. Recruitment form and membership info.",
};
export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const settings = await getSettings();

  if (settings.hideJoin) {
    return (
      <main className="text-center min-h-[60vh] flex flex-col justify-center items-center px-4">
        <h1 className="text-3xl font-bold sm:text-4xl text-[#4F9EFF]">RECRUITMENT CLOSED</h1>
        <p className="mt-4 text-[#ededed]/70 max-w-md">
          The intake system is currently offline. We are not accepting new members at this time.
        </p>
        <Link 
          href="/" 
          className="mt-8 px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm"
        >
          RETURN TO ORIGIN
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Join Us</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        Fill out the form below to apply for membership in GEEKROOM.
      </p>
      <form className="mt-8 space-y-5 sm:mt-12 sm:space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            className="mt-1.5 w-full min-h-[48px] rounded-md border border-foreground/20 bg-background px-4 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="mt-1.5 w-full min-h-[48px] rounded-md border border-foreground/20 bg-background px-4 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium">
            Year / Branch
          </label>
          <input
            id="year"
            type="text"
            name="year"
            placeholder="e.g. 2nd year, CSE"
            className="mt-1.5 w-full min-h-[48px] rounded-md border border-foreground/20 bg-background px-4 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="interest" className="block text-sm font-medium">
            Areas of Interest
          </label>
          <textarea
            id="interest"
            name="interest"
            rows={4}
            placeholder="Web dev, AI, Design, etc."
            className="mt-1.5 w-full min-h-[120px] rounded-md border border-foreground/20 bg-background px-4 py-3 text-base"
          />
        </div>
        <button
          type="submit"
          className="min-h-[48px] w-full rounded-md bg-foreground px-6 py-3 text-background transition active:opacity-90 hover:opacity-90 sm:w-auto"
        >
          Submit Application
        </button>
      </form>
    </main>
  );
}
