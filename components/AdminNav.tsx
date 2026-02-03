import Link from "next/link";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/players", label: "Players" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/series", label: "Series" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/rankings", label: "Rankings" },
  { href: "/admin/stats", label: "Stats" },
  { href: "/admin/venues", label: "Venues" }
];

export default function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-muted">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-white/10 px-3 py-1 hover:text-ink"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
