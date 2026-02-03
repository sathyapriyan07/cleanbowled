"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";
import { Match, Player } from "@/lib/types";

export default function AdminNewsEdit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    player_id: "",
    match_id: "",
    image: ""
  });

  useEffect(() => {
    const load = async () => {
      const [newsRes, playerRes, matchRes] = await Promise.all([
        supabase.from("news").select("*").eq("id", params.id).single(),
        supabase.from("players").select("*").order("name"),
        supabase.from("matches").select("*, team1:team1_id(name), team2:team2_id(name)").order("date", { ascending: false })
      ]);
      const data = newsRes.data;
      if (data) {
        setForm({
          title: data.title ? "",
          content: data.content ? "",
          player_id: data.player_id ? "",
          match_id: data.match_id ? "",
          image: data.image ? ""
        });
      }
      setPlayers((playerRes.data ? []) as Player[]);
      setMatches((matchRes.data ? []) as Match[]);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const save = async () => {
    await supabase.from("news").update(form).eq("id", params.id);
    router.refresh();
  };

  const remove = async () => {
    await supabase.from("news").delete().eq("id", params.id);
    router.replace("/admin/news");
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading news...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Edit News</h2>
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
                {match.team1?.name ? "Team 1"} vs {match.team2?.name ? "Team 2"} · {match.date ? "TBD"}
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
        <div className="flex flex-wrap gap-3">
          <button
            onClick={save}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Save Changes
          </button>
          <button
            onClick={remove}
            className="rounded-xl border border-danger/40 px-4 py-2 text-sm text-danger"
          >
            Delete News
          </button>
        </div>
      </Card>
    </div>
  );
}
