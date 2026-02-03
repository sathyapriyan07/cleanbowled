"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Player } from "@/lib/types";

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    role: "",
    batting_style: "",
    bowling_style: "",
    bio: "",
    profile_image: "",
    banner: ""
  });

  const load = async () => {
    const { data, error: loadError } = await supabase.from("players").select("*").order("name");
    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
    } else {
      setError(null);
    }
    setPlayers((data ?? []) as Player[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const { error: insertError } = await supabase.from("players").insert(form);
    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      return;
    }
    setForm({
      name: "",
      country: "",
      role: "",
      batting_style: "",
      bowling_style: "",
      bio: "",
      profile_image: "",
      banner: ""
    });
    setError(null);
    load();
  };

  const remove = async (id: string) => {
    const { error: deleteError } = await supabase.from("players").delete().eq("id", id);
    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message);
    } else {
      setError(null);
    }
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Player</h2>
        <div className="grid gap-3 md:grid-cols-2">
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
            Country
            <input
              value={form.country}
              onChange={(event) => setForm({ ...form, country: event.target.value })}
              placeholder="Country"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Role
            <input
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              placeholder="Role"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Batting Style
            <input
              value={form.batting_style}
              onChange={(event) => setForm({ ...form, batting_style: event.target.value })}
              placeholder="Batting Style"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Bowling Style
            <input
              value={form.bowling_style}
              onChange={(event) => setForm({ ...form, bowling_style: event.target.value })}
              placeholder="Bowling Style"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <label className="text-xs uppercase tracking-wide text-muted">
          Bio
          <textarea
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
            placeholder="Bio"
            rows={4}
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Profile Image URL
          <input
            value={form.profile_image}
            onChange={(event) => setForm({ ...form, profile_image: event.target.value })}
            placeholder="Profile Image URL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Banner Image URL
          <input
            value={form.banner}
            onChange={(event) => setForm({ ...form, banner: event.target.value })}
            placeholder="Banner Image URL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <button
          onClick={create}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Player
        </button>
        {error ? <p className="text-xs text-danger">Error: {error}</p> : null}
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Existing Players</h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between text-sm">
              <span>{player.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted">{player.country ?? "--"}</span>
                <Link href={`/admin/players/${player.id}`} className="text-xs text-ink">
                  Edit
                </Link>
                <button onClick={() => remove(player.id)} className="text-xs text-danger">
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
