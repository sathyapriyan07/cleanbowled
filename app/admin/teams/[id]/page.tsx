"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Player, TeamRecord, TeamSquad, TeamTrophy, TeamVenuePerformance } from "@/lib/types";

export default function AdminTeamEdit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [squads, setSquads] = useState<TeamSquad[]>([]);
  const [records, setRecords] = useState<TeamRecord[]>([]);
  const [trophies, setTrophies] = useState<TeamTrophy[]>([]);
  const [venuePerf, setVenuePerf] = useState<TeamVenuePerformance[]>([]);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    banner: "",
    captain: "",
    coach: ""
  });

  useEffect(() => {
    const load = async () => {
      const [teamRes, playerRes, squadRes, recordRes, trophyRes, venueRes] = await Promise.all([
        supabase.from("teams").select("*").eq("id", params.id).single(),
        supabase.from("players").select("*").order("name"),
        supabase.from("team_squads").select("*, player:player_id(name)").eq("team_id", params.id),
        supabase.from("team_records").select("*").eq("team_id", params.id),
        supabase.from("team_trophies").select("*").eq("team_id", params.id),
        supabase.from("team_venue_performance").select("*").eq("team_id", params.id)
      ]);
      const data = teamRes.data;
      if (data) {
        setForm({
          name: data.name ? "",
          logo: data.logo ? "",
          banner: data.banner ? "",
          captain: data.captain ? "",
          coach: data.coach ? ""
        });
      }
      setPlayers((playerRes.data ? []) as Player[]);
      setSquads((squadRes.data ? []) as TeamSquad[]);
      setRecords((recordRes.data ? []) as TeamRecord[]);
      setTrophies((trophyRes.data ? []) as TeamTrophy[]);
      setVenuePerf((venueRes.data ? []) as TeamVenuePerformance[]);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const save = async () => {
    await supabase.from("teams").update(form).eq("id", params.id);
    router.refresh();
  };

  const remove = async () => {
    await supabase.from("teams").delete().eq("id", params.id);
    router.replace("/admin/teams");
  };

  const [squadEntry, setSquadEntry] = useState({
    player_id: "",
    role: ""
  });
  const [recordEntry, setRecordEntry] = useState({
    title: "",
    value: "",
    description: ""
  });
  const [trophyEntry, setTrophyEntry] = useState({
    title: "",
    year: "",
    description: ""
  });
  const [venueEntry, setVenueEntry] = useState({
    venue: "",
    matches: 0,
    wins: 0,
    losses: 0,
    no_result: 0
  });

  const addSquad = async () => {
    await supabase.from("team_squads").insert({
      team_id: params.id,
      ...squadEntry
    });
    setSquadEntry({ player_id: "", role: "" });
    router.refresh();
  };

  const addRecord = async () => {
    await supabase.from("team_records").insert({
      team_id: params.id,
      ...recordEntry
    });
    setRecordEntry({ title: "", value: "", description: "" });
    router.refresh();
  };

  const addTrophy = async () => {
    await supabase.from("team_trophies").insert({
      team_id: params.id,
      ...trophyEntry
    });
    setTrophyEntry({ title: "", year: "", description: "" });
    router.refresh();
  };

  const addVenue = async () => {
    await supabase.from("team_venue_performance").insert({
      team_id: params.id,
      ...venueEntry
    });
    setVenueEntry({ venue: "", matches: 0, wins: 0, losses: 0, no_result: 0 });
    router.refresh();
  };

  const removeSquad = async (id: string) => {
    await supabase.from("team_squads").delete().eq("id", id);
    router.refresh();
  };
  const removeRecord = async (id: string) => {
    await supabase.from("team_records").delete().eq("id", id);
    router.refresh();
  };
  const removeTrophy = async (id: string) => {
    await supabase.from("team_trophies").delete().eq("id", id);
    router.refresh();
  };
  const removeVenue = async (id: string) => {
    await supabase.from("team_venue_performance").delete().eq("id", id);
    router.refresh();
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading team...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Edit Team</h2>
        <label className="text-xs uppercase tracking-wide text-muted">
          Team Name
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Team Name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Team Logo URL
          <input
            value={form.logo}
            onChange={(event) => setForm({ ...form, logo: event.target.value })}
            placeholder="Team Logo URL"
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
        <label className="text-xs uppercase tracking-wide text-muted">
          Captain
          <input
            value={form.captain}
            onChange={(event) => setForm({ ...form, captain: event.target.value })}
            placeholder="Captain"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Coach
          <input
            value={form.coach}
            onChange={(event) => setForm({ ...form, coach: event.target.value })}
            placeholder="Coach"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
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
            Delete Team
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Squad</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Player
            <select
              value={squadEntry.player_id}
              onChange={(event) => setSquadEntry({ ...squadEntry, player_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Role
            <input
              value={squadEntry.role}
              onChange={(event) => setSquadEntry({ ...squadEntry, role: event.target.value })}
              placeholder="Role"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addSquad}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Squad Player
        </button>
        <div className="space-y-2 text-sm">
          {squads.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.player?.name ? "Player"} · {row.role ? "Player"}</span>
              <button onClick={() => removeSquad(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Team Records</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Title
            <input
              value={recordEntry.title}
              onChange={(event) => setRecordEntry({ ...recordEntry, title: event.target.value })}
              placeholder="Record Title"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Value
            <input
              value={recordEntry.value}
              onChange={(event) => setRecordEntry({ ...recordEntry, value: event.target.value })}
              placeholder="Record Value"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Description
            <input
              value={recordEntry.description}
              onChange={(event) => setRecordEntry({ ...recordEntry, description: event.target.value })}
              placeholder="Description"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addRecord}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Record
        </button>
        <div className="space-y-2 text-sm">
          {records.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.title ? "Record"} · {row.value ? ""}</span>
              <button onClick={() => removeRecord(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Trophy History</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Title
            <input
              value={trophyEntry.title}
              onChange={(event) => setTrophyEntry({ ...trophyEntry, title: event.target.value })}
              placeholder="Trophy Title"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Year
            <input
              value={trophyEntry.year}
              onChange={(event) => setTrophyEntry({ ...trophyEntry, year: event.target.value })}
              placeholder="Year"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Description
            <input
              value={trophyEntry.description}
              onChange={(event) => setTrophyEntry({ ...trophyEntry, description: event.target.value })}
              placeholder="Description"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addTrophy}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Trophy
        </button>
        <div className="space-y-2 text-sm">
          {trophies.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.title ? "Trophy"} · {row.year ? "—"}</span>
              <button onClick={() => removeTrophy(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Venue Performance</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Venue
            <input
              value={venueEntry.venue}
              onChange={(event) => setVenueEntry({ ...venueEntry, venue: event.target.value })}
              placeholder="Venue"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Matches
            <input
              type="number"
              value={venueEntry.matches}
              onChange={(event) => setVenueEntry({ ...venueEntry, matches: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Wins
            <input
              type="number"
              value={venueEntry.wins}
              onChange={(event) => setVenueEntry({ ...venueEntry, wins: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Losses
            <input
              type="number"
              value={venueEntry.losses}
              onChange={(event) => setVenueEntry({ ...venueEntry, losses: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            No Result
            <input
              type="number"
              value={venueEntry.no_result}
              onChange={(event) => setVenueEntry({ ...venueEntry, no_result: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addVenue}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Venue Performance
        </button>
        <div className="space-y-2 text-sm">
          {venuePerf.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.venue ? "Venue"} · {row.wins}W/{row.losses}L</span>
              <button onClick={() => removeVenue(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
