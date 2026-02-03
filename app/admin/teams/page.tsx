"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Team } from "@/lib/types";

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [captain, setCaptain] = useState("");
  const [coach, setCoach] = useState("");

  const load = async () => {
    const { data, error: loadError } = await supabase.from("teams").select("*").order("name");
    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
    } else {
      setError(null);
    }
    setTeams((data ? []) as Team[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const { error: insertError } = await supabase
      .from("teams")
      .insert({ name, logo, banner, captain, coach });
    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      return;
    }
    setName("");
    setLogo("");
    setBanner("");
    setCaptain("");
    setCoach("");
    setError(null);
    load();
  };

  const remove = async (id: string) => {
    const { error: deleteError } = await supabase.from("teams").delete().eq("id", id);
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
        <h2 className="font-[var(--font-sora)] text-lg">Add Team</h2>
        <label className="text-xs uppercase tracking-wide text-muted">
          Team Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Team Name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Logo Image URL
          <input
            value={logo}
            onChange={(event) => setLogo(event.target.value)}
            placeholder="Logo Image URL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Banner Image URL
          <input
            value={banner}
            onChange={(event) => setBanner(event.target.value)}
            placeholder="Banner Image URL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Captain
          <input
            value={captain}
            onChange={(event) => setCaptain(event.target.value)}
            placeholder="Captain"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Coach
          <input
            value={coach}
            onChange={(event) => setCoach(event.target.value)}
            placeholder="Coach"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <button
          onClick={create}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Team
        </button>
        {error ? <p className="text-xs text-danger">Error: {error}</p> : null}
      </Card>
      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Teams</h3>
        <div className="space-y-2">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between text-sm">
              <span>{team.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted">Logo {team.logo ? "✓" : "—"}</span>
                <Link href={`/admin/teams/${team.id}`} className="text-xs text-ink">
                  Edit
                </Link>
                <button onClick={() => remove(team.id)} className="text-xs text-danger">
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
