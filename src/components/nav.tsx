import { Feather, LayoutGrid, Map, ScrollText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/journal", label: "Journal", icon: ScrollText },
  { href: "/progress", label: "Progress", icon: Map },
];

export const LOG_ITEM: NavItem = {
  href: "/log",
  label: "Log Reading",
  icon: Feather,
};

/** Whether a nav href is active for the current pathname. */
export function isNavActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
