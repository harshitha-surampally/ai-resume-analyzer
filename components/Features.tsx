import FeatureCard from "@/components/ui/FeatureCard";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="max-w-xl">
        <span className="font-mono text-xs tracking-[0.2em] text-mark">
          WHAT IT DOES
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
          One upload, three passes.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          Every resume gets read the way a recruiter, an ATS, and an editor
          each would — separately, then combined into one clear picture.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.tag} {...feature} />
        ))}
      </div>
    </section>
  );
}
