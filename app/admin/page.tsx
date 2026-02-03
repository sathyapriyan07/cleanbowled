"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    players: 0,
    teams: 0,
    matches: 0,
    series: 0,
    news: 0
  });

  useEffect(() => {
    const load = async () => {
      const [players, teams, matches, series, news] = await Promise.all([
        supabase.from("players").select("*", { count: "exact", head: true }),
        supabase.from("teams").select("*", { count: "exact", head: true }),
        supabase.from("matches").select("*", { count: "exact", head: true }),
        supabase.from("series").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true })
      ]);

      setCounts({
        players: players.count ?? 0,
        teams: teams.count ?? 0,
        matches: matches.count ?? 0,
        series: series.count ?? 0,
        news: news.count ?? 0
      });
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[var(--font-sora)] text-xl">Dashboard</h2>
        <p className="text-sm text-muted">Overview of CMS content</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(counts).map(([key, value]) => (
          <Card key={key}>
            <p className="text-xs uppercase tracking-wide text-muted">{key}</p>
            <p className="mt-2 font-[var(--font-sora)] text-2xl">{value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p className="text-sm text-muted">
          All stats updates are manual. Use the CRUD panels above to add players,
          teams, matches, series, and news.
        </p>
      </Card>
    </div>
  );
}
