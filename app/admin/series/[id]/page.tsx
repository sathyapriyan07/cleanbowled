"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";
import { SeriesPoint, SeriesSquad, SeriesStatsLeader, Team, Player } from "@/lib/types";

export default function AdminSeriesEdit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [points, setPoints] = useState<SeriesPoint[]>([]);
  const [squads, setSquads] = useState<SeriesSquad[]>([]);
  const [leaders, setLeaders] = useState<SeriesStatsLeader[]>([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    season: "",
    format: "",
    is_archived: false,
    banner: ""
  });

  useEffect(() => {
    const load = async () => {
      const [
        seriesRes,
        teamRes,
        playerRes,
        pointsRes,
        squadsRes,
        leadersRes
      ] = await Promise.all([
        supabase.from("series").select("*").eq("id", params.id).single(),
        supabase.from("teams").select("*").order("name"),
        supabase.from("players").select("*").order("name"),
        supabase.from("series_points").select("*, team:team_id(name)").eq("series_id", params.id),
        supabase.from("series_squads").select("*, team:team_id(name), player:player_id(name)").eq("series_id", params.id),
        supabase.from("series_stats_leaders").select("*").eq("series_id", params.id)
      ]);

      const data = seriesRes.data;
      if (data) {
        setForm({
          name: data.name ? "",
          location: data.location ? "",
          start_date: data.start_date ? "",
          end_date: data.end_date ? "",
          season: data.season ? "",
          format: data.format ? "",
          is_archived: data.is_archived ? false,
          banner: data.banner ? ""
        });
      }
      setTeams((teamRes.data ? []) as Team[]);
      setPlayers((playerRes.data ? []) as Player[]);
      setPoints((pointsRes.data ? []) as SeriesPoint[]);
      setSquads((squadsRes.data ? []) as SeriesSquad[]);
      setLeaders((leadersRes.data ? []) as SeriesStatsLeader[]);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const save = async () => {
    await supabase.from("series").update(form).eq("id", params.id);
    router.refresh();
  };

  const remove = async () => {
    await supabase.from("series").delete().eq("id", params.id);
    router.replace("/admin/series");
  };

  const [pointEntry, setPointEntry] = useState({
    team_id: "",
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    no_result: 0,
    points: 0,
    net_run_rate: 0
  });
  const [squadEntry, setSquadEntry] = useState({
    team_id: "",
    player_id: "",
    role: ""
  });
  const [leaderEntry, setLeaderEntry] = useState({
    stat_type: "",
    player_name: "",
    team_name: "",
    value: 0
  });

  const addPoint = async () => {
    await supabase.from("series_points").insert({
      series_id: params.id,
      ...pointEntry
    });
    setPointEntry({
      team_id: "",
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      no_result: 0,
      points: 0,
      net_run_rate: 0
    });
    router.refresh();
  };

  const addSquad = async () => {
    await supabase.from("series_squads").insert({
      series_id: params.id,
      ...squadEntry
    });
    setSquadEntry({
      team_id: "",
      player_id: "",
      role: ""
    });
    router.refresh();
  };

  const addLeader = async () => {
    await supabase.from("series_stats_leaders").insert({
      series_id: params.id,
      ...leaderEntry
    });
    setLeaderEntry({
      stat_type: "",
      player_name: "",
      team_name: "",
      value: 0
    });
    router.refresh();
  };

  const removePoint = async (id: string) => {
    await supabase.from("series_points").delete().eq("id", id);
    router.refresh();
  };

  const removeSquad = async (id: string) => {
    await supabase.from("series_squads").delete().eq("id", id);
    router.refresh();
  };

  const removeLeader = async (id: string) => {
    await supabase.from("series_stats_leaders").delete().eq("id", id);
    router.refresh();
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading series...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Edit Series</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Series Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Series Name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Location
            <input
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              placeholder="Location"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Start Date
            <input
              value={form.start_date}
              onChange={(event) => setForm({ ...form, start_date: event.target.value })}
              placeholder="Start Date"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            End Date
            <input
              value={form.end_date}
              onChange={(event) => setForm({ ...form, end_date: event.target.value })}
              placeholder="End Date"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Season
            <input
              value={form.season}
              onChange={(event) => setForm({ ...form, season: event.target.value })}
              placeholder="Season (e.g., 2025-26)"
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
            Archived
            <select
              value={form.is_archived ? "yes" : "no"}
              onChange={(event) => setForm({ ...form, is_archived: event.target.value === "yes" })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>
        <div className="text-xs uppercase tracking-wide text-muted">
          Series Banner
          <div className="mt-2">
            <ImageUploader
              bucket="series"
              label="Series Banner"
              onUploaded={(url) => setForm({ ...form, banner: url })}
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
            Delete Series
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Points Table</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Team
            <select
              value={pointEntry.team_id}
              onChange={(event) => setPointEntry({ ...pointEntry, team_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Played
            <input
              type="number"
              value={pointEntry.played}
              onChange={(event) => setPointEntry({ ...pointEntry, played: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Won
            <input
              type="number"
              value={pointEntry.won}
              onChange={(event) => setPointEntry({ ...pointEntry, won: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Lost
            <input
              type="number"
              value={pointEntry.lost}
              onChange={(event) => setPointEntry({ ...pointEntry, lost: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Tied
            <input
              type="number"
              value={pointEntry.tied}
              onChange={(event) => setPointEntry({ ...pointEntry, tied: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            No Result
            <input
              type="number"
              value={pointEntry.no_result}
              onChange={(event) => setPointEntry({ ...pointEntry, no_result: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Points
            <input
              type="number"
              value={pointEntry.points}
              onChange={(event) => setPointEntry({ ...pointEntry, points: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Net Run Rate
            <input
              type="number"
              value={pointEntry.net_run_rate}
              onChange={(event) => setPointEntry({ ...pointEntry, net_run_rate: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addPoint}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Points Row
        </button>
        <div className="space-y-2 text-sm">
          {points.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.team?.name ? "Team"} · {row.points} pts</span>
              <button onClick={() => removePoint(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Squads</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Team
            <select
              value={squadEntry.team_id}
              onChange={(event) => setSquadEntry({ ...squadEntry, team_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
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
              <span>{row.team?.name ? "Team"} · {row.player?.name ? "Player"}</span>
              <button onClick={() => removeSquad(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Stats Leaders</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Stat Type
            <input
              value={leaderEntry.stat_type}
              onChange={(event) => setLeaderEntry({ ...leaderEntry, stat_type: event.target.value })}
              placeholder="Most Runs / Most Wickets"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player Name
            <input
              value={leaderEntry.player_name}
              onChange={(event) => setLeaderEntry({ ...leaderEntry, player_name: event.target.value })}
              placeholder="Player Name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team Name
            <input
              value={leaderEntry.team_name}
              onChange={(event) => setLeaderEntry({ ...leaderEntry, team_name: event.target.value })}
              placeholder="Team Name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Value
            <input
              type="number"
              value={leaderEntry.value}
              onChange={(event) => setLeaderEntry({ ...leaderEntry, value: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addLeader}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Stats Leader
        </button>
        <div className="space-y-2 text-sm">
          {leaders.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.stat_type ? "Stat"} · {row.player_name ? "Player"}</span>
              <button onClick={() => removeLeader(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
