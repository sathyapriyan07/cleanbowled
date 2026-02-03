"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";
import { Match, News, Player } from "@/lib/types";

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    player_id: "",
    match_id: "",
    image: ""
  });

  const load = async () => {
    const [newsRes, playerRes, matchRes] = await Promise.all([
      supabase.from("news").select("*").order("id", { ascending: false }),
      supabase.from("players").select("*").order("name"),
      supabase.from("matches").select("*, team1:team1_id(name), team2:team2_id(name)").order("date", { ascending: false })
    ]);
    setNews((newsRes.data ?? []) as News[]);
    setPlayers((playerRes.data ?? []) as Player[]);
    setMatches((matchRes.data ?? []) as Match[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await supabase.from("news").insert(form);
    setForm({ title: "", content: "", player_id: "", match_id: "", image: "" });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("news").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add News</h2>
        <label className="text-xs uppercase tracking-wide text-muted">
          Headline
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Headline"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Content
          <textarea
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            placeholder="Content"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Player (optional)
          <select
            value={form.player_id}
            onChange={(event) => setForm({ ...form, player_id: event.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          >
            <option value="">Player (optional)</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Match (optional)
          <select
            value={form.match_id}
            onChange={(event) => setForm({ ...form, match_id: event.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          >
            <option value="">Match (optional)</option>
            {matches.map((match: any) => (
              <option key={match.id} value={match.id}>
                {match.team1?.name ?? "Team 1"} vs {match.team2?.name ?? "Team 2"} · {match.date ?? "TBD"}
              </option>
            ))}
          </select>
        </label>
        <div className="text-xs uppercase tracking-wide text-muted">
          News Image
          <div className="mt-2">
            <ImageUploader
              bucket="news"
              label="News Image"
              onUploaded={(url) => setForm({ ...form, image: url })}
            />
          </div>
        </div>
        <button
          onClick={create}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save News
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">News Articles</h3>
        <div className="space-y-2 text-sm">
          {news.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>{item.title}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted">{item.player_id ? "Player-linked" : "General"}</span>
                <Link href={`/admin/news/${item.id}`} className="text-xs text-ink">
                  Edit
                </Link>
                <button onClick={() => remove(item.id)} className="text-xs text-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
