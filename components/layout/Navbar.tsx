"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="#home"
          className="flex items-center gap-2 font-display text-lg font-semibold text-paper"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-mark font-mono text-sm font-bold text-ink">
            R
          </span>
          Resume<span className="text-mark">Analyzer</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="#home" className="px-5 py-2.5">
            Get Started
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-line text-paper md:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {isOpen ? (
              <path d="M5 5L15 15M15 5L5 15" />
            ) : (
              <path d="M3 6H17M3 10H17M3 14H17" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile nav panel */}
      {isOpen && (
        <div className="border-t border-ink-line bg-ink px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-ink-soft transition-colors hover:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="#home" className="mt-6 w-full">
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
}
