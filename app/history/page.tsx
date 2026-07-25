import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function HistoryPage() {
  const analyses = await prisma.analysis.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      overallScore: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-paper">
        Analysis History
      </h1>

      <p className="mt-2 text-sm text-ink-soft">
        Previously analyzed resumes, newest first.
      </p>

      {analyses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-ink-line bg-ink/40 px-5 py-8 text-center">
          <p className="text-sm text-ink-soft">
            No analyses yet. Upload and analyze a resume to see it here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
         {analyses.map((analysis) => (
  <li key={analysis.id}>
    <Link
      href={`/analysis/${analysis.id}`}
      className="block rounded-xl border border-ink-line bg-ink/40 px-5 py-4 transition-colors hover:border-paper/40"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="truncate text-sm font-medium text-paper">
          {analysis.filename}
        </p>

        <span className="shrink-0 font-mono text-xs text-mark">
          {analysis.overallScore}/100
        </span>
      </div>

      <p className="mt-1 text-xs text-ink-soft">
        {formatDate(analysis.createdAt)}
      </p>
    </Link>
  </li>
))}
        </ul>
      )}
    </div>
  );
}