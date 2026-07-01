import { Feature, NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const FEATURES: Feature[] = [
  {
    tag: "PARSE",
    title: "Resume Analysis",
    description:
      "Breaks your resume down section by section, checking structure, formatting, and keyword density against what recruiters actually scan for.",
  },
  {
    tag: "MATCH",
    title: "ATS Match",
    description:
      "Scores your resume against a target job description, so you know exactly how likely it is to clear the applicant tracking system before a human sees it.",
  },
  {
    tag: "SUGGEST",
    title: "AI Suggestions",
    description:
      "Rewrites weak bullet points into clear, quantified achievements, and flags gaps a hiring manager would notice at a glance.",
  },
];
