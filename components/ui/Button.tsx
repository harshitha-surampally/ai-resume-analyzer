import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const VARIANT_STYLES: Record<Required<ButtonProps>["variant"], string> = {
  primary:
    "bg-mark text-ink hover:bg-mark-soft hover:text-ink transition-colors",
  secondary:
    "bg-transparent text-paper border border-ink-line hover:border-paper transition-colors",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide whitespace-nowrap ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
