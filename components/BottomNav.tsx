"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Players", href: "/players" },
  { label: "Teams", href: "/teams" },
  { label: "Matches", href: "/matches" },
  { label: "Series", href: "/series" },
  { label: "Login", href: "/admin/login" }
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 z-40 w-full border-t border-white/5 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-between px-4 py-3 text-[10px] uppercase tracking-wide text-muted">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-2 py-1 transition ${
                active ? "bg-cardAlt text-ink shadow-soft" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
