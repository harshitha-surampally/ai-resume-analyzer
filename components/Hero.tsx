import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="home"
      className="mx-auto grid max-w-6xl gap-14 px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:grid-cols-2 lg:items-center lg:gap-10"
    >
      {/* Copy */}
      <div>
        <span className="font-mono text-xs tracking-[0.2em] text-mark">
          AI RESUME ANALYZER
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-paper sm:text-5xl lg:text-6xl">
          Turn your resume into an{" "}
          <span className="underline decoration-mark decoration-4 underline-offset-4">
            interview magnet
          </span>
          .
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
          Upload your resume, get an ATS compatibility score, and walk away
          with concrete, line-by-line suggestions — before a recruiter ever
          sees it.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="#features">Analyze your resume</Button>
          <Button href="#features" variant="secondary">
            See how it works
          </Button>
        </div>
      </div>

      {/* Signature visual: an annotated resume line with a margin comment */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-ink-line bg-paper p-6 shadow-2xl shadow-black/30 sm:p-8">
          {/* scanning line */}
          <div
            aria-hidden="true"
            className="animate-scanline pointer-events-none absolute left-0 right-0 h-px bg-mark/70"
          />

          <p className="font-mono text-[11px] tracking-[0.15em] text-ink-soft/70">
            resume.pdf — page 1
          </p>

          <div className="mt-5 space-y-3">
            <div className="h-3 w-2/5 rounded-full bg-ink/70" />
            <div className="h-2 w-4/5 rounded-full bg-ink/20" />
            <div className="h-2 w-3/5 rounded-full bg-ink/20" />

            <div className="relative mt-6 flex items-center gap-3 rounded-md bg-mark-soft/60 px-3 py-2">
              <div className="h-2 flex-1 rounded-full bg-ink/40" />
              <span className="font-mono text-[10px] font-semibold text-mark">
                weak verb
              </span>
            </div>

            <div className="h-2 w-4/5 rounded-full bg-ink/20" />
            <div className="h-2 w-2/3 rounded-full bg-ink/20" />
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-ink-line/40 bg-ink px-4 py-3">
            <span className="font-mono text-xs text-ink-soft">
              ATS Match
            </span>
            <span className="font-mono text-sm font-semibold text-signal">
              92%
            </span>
          </div>
        </div>

        {/* margin comment bubble */}
        <div className="absolute -right-4 -top-4 hidden max-w-[11rem] rounded-xl border border-ink-line bg-ink px-4 py-3 shadow-xl sm:block">
          <p className="font-mono text-[11px] leading-relaxed text-paper">
            Try: &quot;Reduced load time by 40%&quot; instead of &quot;Helped
            with performance.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
