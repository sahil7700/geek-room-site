import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — GEEKROOM JIMSEMTC",
  description: "Projects and achievements by GEEKROOM JIMSEMTC members.",
};

const mockProjects = [
  { title: "Project Alpha", desc: "Description of project Alpha.", tags: ["Web", "Open Source"] },
  { title: "Project Beta", desc: "Description of project Beta.", tags: ["ML", "AI"] },
  { title: "Project Gamma", desc: "Description of project Gamma.", tags: ["Mobile", "IoT"] },
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Projects & Achievements</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        Showcasing what our community builds together.
      </p>
      <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {mockProjects.map((project, i) => (
          <article
            key={i}
            className="rounded-lg border border-foreground/10 p-5 sm:p-6"
          >
            <h3 className="font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm text-foreground/80">{project.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
