import { Feature } from "@/types";

export default function FeatureCard({ tag, title, description }: Feature) {
  return (
    <div className="group relative rounded-2xl border border-ink-line bg-ink/60 p-6 sm:p-8 transition-colors hover:border-mark/60">
      <span className="font-mono text-xs tracking-[0.2em] text-mark">
        {tag}
      </span>
      <h3 className="mt-4 font-display text-xl sm:text-2xl font-semibold text-paper">
        {title}
      </h3>
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-soft">
        {description}
      </p>
    </div>
  );
}
