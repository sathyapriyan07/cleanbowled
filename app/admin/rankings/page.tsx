"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Ranking } from "@/lib/types";

export default function AdminRankings() {
  const [rows, setRows] = useState<Ranking[]>([]);
  const [form, setForm] = useState({
    category: "",
    format: "",
    rank: 1,
    name: "",
    team: "",
    rating: 0
  });

  const load = async () => {
    const { data } = await supabase.from("rankings").select("*").order("rank");
    setRows((data ?? []) as Ranking[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await supabase.from("rankings").insert(form);
    setForm({
      category: "",
      format: "",
      rank: 1,
      name: "",
      team: "",
      rating: 0
    });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("rankings").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Ranking</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Category
            <input
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              placeholder="Teams / Batting / Bowling"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Format
            <input
              value={form.format}
              onChange={(event) => setForm({ ...form, format: event.target.value })}
              placeholder="T20I / ODI / Test"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Rank
            <input
              type="number"
              value={form.rank}
              onChange={(event) => setForm({ ...form, rank: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team
            <input
              value={form.team}
              onChange={(event) => setForm({ ...form, team: event.target.value })}
              placeholder="Team"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Rating
            <input
              type="number"
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={create}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Ranking
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Rankings</h3>
        <div className="space-y-2 text-sm">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>#{row.rank} · {row.name ?? "Name"} · {row.format ?? "Format"}</span>
              <button onClick={() => remove(row.id)} className="text-xs text-danger">
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
