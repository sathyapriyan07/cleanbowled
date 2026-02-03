"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Match, Player, Series, Team } from "@/lib/types";

export default function AdminMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [form, setForm] = useState({
    series_id: "",
    team1_id: "",
    team2_id: "",
    format: "",
    score1: "",
    score2: "",
    overs1: "",
    overs2: "",
    result: "",
    venue: "",
    date: "",
    status: "",
    thumbnail: "",
    toss_winner_id: "",
    toss_decision: "",
    umpires: "",
    referee: "",
    player_of_match_id: ""
  });
  const [scorecard, setScorecard] = useState({
    match_id: "",
    player_id: "",
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strike_rate: 0
  });
  const [playingXI, setPlayingXI] = useState({
    match_id: "",
    player_id: "",
    team_id: "",
    status: "IN"
  });

  const load = async () => {
    const [matchRes, teamRes, seriesRes, playerRes] = await Promise.all([
      supabase.from("matches").select("*").order("date", { ascending: false }),
      supabase.from("teams").select("*").order("name"),
      supabase.from("series").select("*").order("start_date", { ascending: false }),
      supabase.from("players").select("*").order("name")
    ]);
    setMatches((matchRes.data ?? []) as Match[]);
    setTeams((teamRes.data ?? []) as Team[]);
    setSeries((seriesRes.data ?? []) as Series[]);
    setPlayers((playerRes.data ?? []) as Player[]);
  };

  useEffect(() => {
    load();
  }, []);

  const createMatch = async () => {
    await supabase.from("matches").insert(form);
    setForm({
      series_id: "",
      team1_id: "",
      team2_id: "",
      format: "",
      score1: "",
      score2: "",
      overs1: "",
      overs2: "",
      result: "",
      venue: "",
      date: "",
      status: "",
      thumbnail: "",
      toss_winner_id: "",
      toss_decision: "",
      umpires: "",
      referee: "",
      player_of_match_id: ""
    });
    load();
  };

  const addScorecard = async () => {
    await supabase.from("match_batting").insert(scorecard);
    setScorecard({
      match_id: "",
      player_id: "",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strike_rate: 0
    });
  };

  const addPlayingXI = async () => {
    await supabase.from("match_playing_xi").insert(playingXI);
    setPlayingXI({
      match_id: "",
      player_id: "",
      team_id: "",
      status: "IN"
    });
  };

  const remove = async (id: string) => {
    await supabase.from("matches").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Match</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Series
            <select
              value={form.series_id}
              onChange={(event) => setForm({ ...form, series_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Select Series</option>
              {series.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team 1
            <select
              value={form.team1_id}
              onChange={(event) => setForm({ ...form, team1_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team 1</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team 2
            <select
              value={form.team2_id}
              onChange={(event) => setForm({ ...form, team2_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team 2</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
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
            Date
            <input
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              placeholder="Date"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Venue
            <input
              value={form.venue}
              onChange={(event) => setForm({ ...form, venue: event.target.value })}
              placeholder="Venue"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Status
            <input
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              placeholder="Status"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Score Team 1
            <input
              value={form.score1}
              onChange={(event) => setForm({ ...form, score1: event.target.value })}
              placeholder="Score Team 1"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Overs Team 1
            <input
              value={form.overs1}
              onChange={(event) => setForm({ ...form, overs1: event.target.value })}
              placeholder="Overs Team 1"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Score Team 2
            <input
              value={form.score2}
              onChange={(event) => setForm({ ...form, score2: event.target.value })}
              placeholder="Score Team 2"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Overs Team 2
            <input
              value={form.overs2}
              onChange={(event) => setForm({ ...form, overs2: event.target.value })}
              placeholder="Overs Team 2"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Result
            <input
              value={form.result}
              onChange={(event) => setForm({ ...form, result: event.target.value })}
              placeholder="Result"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Toss Winner
            <select
              value={form.toss_winner_id}
              onChange={(event) => setForm({ ...form, toss_winner_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Toss Winner</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Toss Decision
            <input
              value={form.toss_decision}
              onChange={(event) => setForm({ ...form, toss_decision: event.target.value })}
              placeholder="Bat / Bowl"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Umpires
            <input
              value={form.umpires}
              onChange={(event) => setForm({ ...form, umpires: event.target.value })}
              placeholder="Umpires"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Referee
            <input
              value={form.referee}
              onChange={(event) => setForm({ ...form, referee: event.target.value })}
              placeholder="Referee"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player of the Match
            <select
              value={form.player_of_match_id}
              onChange={(event) => setForm({ ...form, player_of_match_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Player of the Match</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="text-xs uppercase tracking-wide text-muted">
          Thumbnail URL
          <input
            value={form.thumbnail}
            onChange={(event) => setForm({ ...form, thumbnail: event.target.value })}
            placeholder="Thumbnail URL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <button
          onClick={createMatch}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Match
        </button>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Scorecard Entry</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Match ID
            <input
              value={scorecard.match_id}
              onChange={(event) => setScorecard({ ...scorecard, match_id: event.target.value })}
              placeholder="Match ID"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player
            <select
              value={scorecard.player_id}
              onChange={(event) => setScorecard({ ...scorecard, player_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Runs
            <input
              type="number"
              value={scorecard.runs}
              onChange={(event) => setScorecard({ ...scorecard, runs: Number(event.target.value) })}
              placeholder="Runs"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Balls
            <input
              type="number"
              value={scorecard.balls}
              onChange={(event) => setScorecard({ ...scorecard, balls: Number(event.target.value) })}
              placeholder="Balls"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Fours
            <input
              type="number"
              value={scorecard.fours}
              onChange={(event) => setScorecard({ ...scorecard, fours: Number(event.target.value) })}
              placeholder="4s"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Sixes
            <input
              type="number"
              value={scorecard.sixes}
              onChange={(event) => setScorecard({ ...scorecard, sixes: Number(event.target.value) })}
              placeholder="6s"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Strike Rate
            <input
              type="number"
              value={scorecard.strike_rate}
              onChange={(event) => setScorecard({ ...scorecard, strike_rate: Number(event.target.value) })}
              placeholder="Strike Rate"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addScorecard}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Scorecard Row
        </button>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Playing XI</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Match ID
            <input
              value={playingXI.match_id}
              onChange={(event) => setPlayingXI({ ...playingXI, match_id: event.target.value })}
              placeholder="Match ID"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player
            <select
              value={playingXI.player_id}
              onChange={(event) => setPlayingXI({ ...playingXI, player_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team
            <select
              value={playingXI.team_id}
              onChange={(event) => setPlayingXI({ ...playingXI, team_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Status
            <select
              value={playingXI.status}
              onChange={(event) => setPlayingXI({ ...playingXI, status: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </label>
        </div>
        <button
          onClick={addPlayingXI}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Player
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Matches</h3>
        <div className="space-y-2 text-sm">
          {matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between">
              <span>{match.date ?? "TBD"}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted">{match.result ?? "Scheduled"}</span>
                <Link href={`/admin/matches/${match.id}`} className="text-xs text-ink">
                  Edit
                </Link>
                <button onClick={() => remove(match.id)} className="text-xs text-danger">
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
