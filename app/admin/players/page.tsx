"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Player } from "@/lib/types";

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
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
    const { data } = await supabase.from("players").select("*").order("name");
    setPlayers((data ?? []) as Player[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await supabase.from("players").insert(form);
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
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("players").delete().eq("id", id);
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
