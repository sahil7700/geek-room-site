import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — GEEKROOM JIMSEMTC",
  description: "Get in touch with GEEKROOM JIMSEMTC.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Contact</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        Have questions or want to collaborate? Reach out to us.
      </p>
      <div className="mt-8 space-y-6 sm:mt-12">
        <div>
          <h3 className="font-semibold">Email</h3>
          <a
            href="mailto:geekroom@jimsemtc.in"
            className="inline-block min-h-[44px] py-2 text-foreground/80 underline hover:text-foreground"
          >
            geekroom@jimsemtc.in
          </a>
        </div>
        <div>
          <h3 className="font-semibold">Social</h3>
          <p className="text-foreground/80">Follow us on LinkedIn, Instagram, and GitHub.</p>
        </div>
        <div>
          <h3 className="font-semibold">Send a message</h3>
          <form className="mt-3 space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full min-h-[48px] rounded-md border border-foreground/20 bg-background px-4 py-3 text-base"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full min-h-[120px] rounded-md border border-foreground/20 bg-background px-4 py-3 text-base"
            />
            <button
              type="submit"
              className="min-h-[48px] w-full rounded-md bg-foreground px-6 py-3 text-background transition active:opacity-90 hover:opacity-90 sm:w-auto"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
