"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import {
  Match,
  MatchBatting,
  MatchBowling,
  MatchFallOfWicket,
  MatchHeadToHead,
  MatchPartnership,
  MatchSummary,
  PlayerMatchStats,
  PlayingXI,
  Player,
  Series,
  Team
} from "@/lib/types";

export default function AdminMatchEdit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [battingRows, setBattingRows] = useState<MatchBatting[]>([]);
  const [bowlingRows, setBowlingRows] = useState<MatchBowling[]>([]);
  const [playingXI, setPlayingXI] = useState<PlayingXI[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerMatchStats[]>([]);
  const [partnerships, setPartnerships] = useState<MatchPartnership[]>([]);
  const [fallOfWickets, setFallOfWickets] = useState<MatchFallOfWicket[]>([]);
  const [summary, setSummary] = useState<MatchSummary | null>(null);
  const [headToHead, setHeadToHead] = useState<MatchHeadToHead | null>(null);
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
    player_id: "",
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strike_rate: 0
  });
  const [xiEntry, setXiEntry] = useState({
    player_id: "",
    team_id: "",
    status: "IN"
  });
  const [bowlingEntry, setBowlingEntry] = useState({
    player_id: "",
    overs: 0,
    maidens: 0,
    runs_conceded: 0,
    wickets: 0,
    economy: 0
  });
  const [partnershipEntry, setPartnershipEntry] = useState({
    team_id: "",
    players: "",
    runs: 0,
    balls: 0,
    wicket_number: 0
  });
  const [fowEntry, setFowEntry] = useState({
    team_id: "",
    wicket_number: 0,
    score: "",
    over: "",
    player_out: ""
  });
  const [summaryEntry, setSummaryEntry] = useState({
    key_moments: "",
    highlights: ""
  });
  const [h2hEntry, setH2hEntry] = useState({
    team1_id: "",
    team2_id: "",
    team1_wins: 0,
    team2_wins: 0,
    no_result: 0
  });
  const [statEntry, setStatEntry] = useState({
    player_id: "",
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strike_rate: 0,
    average: 0,
    innings: 1,
    not_outs: 0
  });

  const load = async () => {
    const [
      matchRes,
      teamRes,
      seriesRes,
      playerRes,
      battingRes,
      bowlingRes,
      xiRes,
      statsRes,
      partnershipsRes,
      fowRes,
      summaryRes,
      h2hRes
    ] = await Promise.all([
      supabase.from("matches").select("*").eq("id", params.id).single(),
      supabase.from("teams").select("*").order("name"),
      supabase.from("series").select("*").order("start_date", { ascending: false }),
      supabase.from("players").select("*").order("name"),
      supabase.from("match_batting").select("*, player:player_id(name)").eq("match_id", params.id),
      supabase.from("match_bowling").select("*, player:player_id(name)").eq("match_id", params.id),
      supabase.from("match_playing_xi").select("*, player:player_id(name), team:team_id(name)").eq("match_id", params.id),
      supabase.from("player_match_stats").select("*, player:player_id(name)").eq("match_id", params.id),
      supabase.from("match_partnerships").select("*, team:team_id(name)").eq("match_id", params.id),
      supabase.from("match_fall_of_wickets").select("*, team:team_id(name)").eq("match_id", params.id),
      supabase.from("match_summary").select("*").eq("match_id", params.id).maybeSingle(),
      supabase.from("match_head_to_head").select("*").eq("match_id", params.id).maybeSingle()
    ]);

    const data = matchRes.data as Match | null;
      if (data) {
        setForm({
          series_id: data.series_id ?? "",
          team1_id: data.team1_id ?? "",
          team2_id: data.team2_id ?? "",
          format: data.format ?? "",
          score1: data.score1 ?? "",
          score2: data.score2 ?? "",
          overs1: data.overs1 ?? "",
        overs2: data.overs2 ?? "",
        result: data.result ?? "",
        venue: data.venue ?? "",
        date: data.date ?? "",
        status: data.status ?? "",
        thumbnail: data.thumbnail ?? "",
        toss_winner_id: data.toss_winner_id ?? "",
        toss_decision: data.toss_decision ?? "",
        umpires: data.umpires ?? "",
        referee: data.referee ?? "",
        player_of_match_id: data.player_of_match_id ?? ""
      });
    }

    setTeams((teamRes.data ?? []) as Team[]);
    setSeries((seriesRes.data ?? []) as Series[]);
    setPlayers((playerRes.data ?? []) as Player[]);
    setBattingRows((battingRes.data ?? []) as MatchBatting[]);
    setBowlingRows((bowlingRes.data ?? []) as MatchBowling[]);
    setPlayingXI((xiRes.data ?? []) as PlayingXI[]);
    setPlayerStats((statsRes.data ?? []) as PlayerMatchStats[]);
    setPartnerships((partnershipsRes.data ?? []) as MatchPartnership[]);
    setFallOfWickets((fowRes.data ?? []) as MatchFallOfWicket[]);
    setSummary((summaryRes.data ?? null) as MatchSummary | null);
    setHeadToHead((h2hRes.data ?? null) as MatchHeadToHead | null);
    setSummaryEntry({
      key_moments: summaryRes.data?.key_moments ?? "",
      highlights: summaryRes.data?.highlights ?? ""
    });
    setH2hEntry({
      team1_id: h2hRes.data?.team1_id ?? "",
      team2_id: h2hRes.data?.team2_id ?? "",
      team1_wins: h2hRes.data?.team1_wins ?? 0,
      team2_wins: h2hRes.data?.team2_wins ?? 0,
      no_result: h2hRes.data?.no_result ?? 0
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const save = async () => {
    await supabase.from("matches").update(form).eq("id", params.id);
    router.refresh();
  };

  const remove = async () => {
    await supabase.from("matches").delete().eq("id", params.id);
    router.replace("/admin/matches");
  };

  const addScorecard = async () => {
    await supabase.from("match_batting").insert({
      match_id: params.id,
      ...scorecard
    });
    setScorecard({
      player_id: "",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strike_rate: 0
    });
    load();
  };

  const addPlayingXI = async () => {
    await supabase.from("match_playing_xi").insert({
      match_id: params.id,
      ...xiEntry
    });
    setXiEntry({
      player_id: "",
      team_id: "",
      status: "IN"
    });
    load();
  };

  const addPlayerStats = async () => {
    await supabase.from("player_match_stats").insert({
      match_id: params.id,
      ...statEntry
    });
    setStatEntry({
      player_id: "",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strike_rate: 0,
      average: 0,
      innings: 1,
      not_outs: 0
    });
    load();
  };

  const addBowling = async () => {
    await supabase.from("match_bowling").insert({
      match_id: params.id,
      ...bowlingEntry
    });
    setBowlingEntry({
      player_id: "",
      overs: 0,
      maidens: 0,
      runs_conceded: 0,
      wickets: 0,
      economy: 0
    });
    load();
  };

  const addPartnership = async () => {
    await supabase.from("match_partnerships").insert({
      match_id: params.id,
      ...partnershipEntry
    });
    setPartnershipEntry({
      team_id: "",
      players: "",
      runs: 0,
      balls: 0,
      wicket_number: 0
    });
    load();
  };

  const addFow = async () => {
    await supabase.from("match_fall_of_wickets").insert({
      match_id: params.id,
      ...fowEntry
    });
    setFowEntry({
      team_id: "",
      wicket_number: 0,
      score: "",
      over: "",
      player_out: ""
    });
    load();
  };

  const saveSummary = async () => {
    if (summary?.id) {
      await supabase.from("match_summary").update(summaryEntry).eq("id", summary.id);
    } else {
      await supabase.from("match_summary").insert({
        match_id: params.id,
        ...summaryEntry
      });
    }
    load();
  };

  const saveHeadToHead = async () => {
    if (headToHead?.id) {
      await supabase.from("match_head_to_head").update(h2hEntry).eq("id", headToHead.id);
    } else {
      await supabase.from("match_head_to_head").insert({
        match_id: params.id,
        ...h2hEntry
      });
    }
    load();
  };

  const removeBatting = async (id: string) => {
    await supabase.from("match_batting").delete().eq("id", id);
    load();
  };

  const removeBowling = async (id: string) => {
    await supabase.from("match_bowling").delete().eq("id", id);
    load();
  };

  const removeXI = async (id: string) => {
    await supabase.from("match_playing_xi").delete().eq("id", id);
    load();
  };

  const removePlayerStats = async (id: string) => {
    await supabase.from("player_match_stats").delete().eq("id", id);
    load();
  };

  const removePartnership = async (id: string) => {
    await supabase.from("match_partnerships").delete().eq("id", id);
    load();
  };

  const removeFow = async (id: string) => {
    await supabase.from("match_fall_of_wickets").delete().eq("id", id);
    load();
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading match...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Edit Match</h2>
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
            Delete Match
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Scorecard Entry</h3>
        <div className="grid gap-3 md:grid-cols-2">
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
        <div className="space-y-2 text-sm">
          {battingRows.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.player?.name ?? "Batter"} · {row.runs}/{row.balls}</span>
              <button onClick={() => removeBatting(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Bowling Entry</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Player
            <select
              value={bowlingEntry.player_id}
              onChange={(event) => setBowlingEntry({ ...bowlingEntry, player_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Overs
            <input
              type="number"
              value={bowlingEntry.overs}
              onChange={(event) => setBowlingEntry({ ...bowlingEntry, overs: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Maidens
            <input
              type="number"
              value={bowlingEntry.maidens}
              onChange={(event) => setBowlingEntry({ ...bowlingEntry, maidens: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Runs Conceded
            <input
              type="number"
              value={bowlingEntry.runs_conceded}
              onChange={(event) => setBowlingEntry({ ...bowlingEntry, runs_conceded: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Wickets
            <input
              type="number"
              value={bowlingEntry.wickets}
              onChange={(event) => setBowlingEntry({ ...bowlingEntry, wickets: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Economy
            <input
              type="number"
              value={bowlingEntry.economy}
              onChange={(event) => setBowlingEntry({ ...bowlingEntry, economy: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addBowling}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Bowling Row
        </button>
        <div className="space-y-2 text-sm">
          {bowlingRows.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.player?.name ?? "Bowler"} · {row.overs}-{row.maidens}-{row.runs_conceded}-{row.wickets}</span>
              <button onClick={() => removeBowling(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Playing XI</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Player
            <select
              value={xiEntry.player_id}
              onChange={(event) => setXiEntry({ ...xiEntry, player_id: event.target.value })}
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
              value={xiEntry.team_id}
              onChange={(event) => setXiEntry({ ...xiEntry, team_id: event.target.value })}
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
              value={xiEntry.status}
              onChange={(event) => setXiEntry({ ...xiEntry, status: event.target.value })}
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
        <div className="space-y-2 text-sm">
          {playingXI.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.player?.name ?? "Player"} · {row.team?.name ?? "Team"} · {row.status}</span>
              <button onClick={() => removeXI(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Partnerships</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Team
            <select
              value={partnershipEntry.team_id}
              onChange={(event) => setPartnershipEntry({ ...partnershipEntry, team_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Players
            <input
              value={partnershipEntry.players}
              onChange={(event) => setPartnershipEntry({ ...partnershipEntry, players: event.target.value })}
              placeholder="Player A & Player B"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Runs
            <input
              type="number"
              value={partnershipEntry.runs}
              onChange={(event) => setPartnershipEntry({ ...partnershipEntry, runs: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Balls
            <input
              type="number"
              value={partnershipEntry.balls}
              onChange={(event) => setPartnershipEntry({ ...partnershipEntry, balls: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Wicket Number
            <input
              type="number"
              value={partnershipEntry.wicket_number}
              onChange={(event) => setPartnershipEntry({ ...partnershipEntry, wicket_number: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addPartnership}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Partnership
        </button>
        <div className="space-y-2 text-sm">
          {partnerships.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.players} · {row.runs} ({row.balls})</span>
              <button onClick={() => removePartnership(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Fall of Wickets</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Team
            <select
              value={fowEntry.team_id}
              onChange={(event) => setFowEntry({ ...fowEntry, team_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Wicket Number
            <input
              type="number"
              value={fowEntry.wicket_number}
              onChange={(event) => setFowEntry({ ...fowEntry, wicket_number: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Score
            <input
              value={fowEntry.score}
              onChange={(event) => setFowEntry({ ...fowEntry, score: event.target.value })}
              placeholder="Score"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Over
            <input
              value={fowEntry.over}
              onChange={(event) => setFowEntry({ ...fowEntry, over: event.target.value })}
              placeholder="Over"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player Out
            <input
              value={fowEntry.player_out}
              onChange={(event) => setFowEntry({ ...fowEntry, player_out: event.target.value })}
              placeholder="Player Out"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addFow}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Fall of Wicket
        </button>
        <div className="space-y-2 text-sm">
          {fallOfWickets.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.player_out ?? "Player"} · {row.score} ({row.over})</span>
              <button onClick={() => removeFow(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Summary</h3>
        <label className="text-xs uppercase tracking-wide text-muted">
          Key Moments
          <textarea
            value={summaryEntry.key_moments}
            onChange={(event) => setSummaryEntry({ ...summaryEntry, key_moments: event.target.value })}
            placeholder="Key Moments"
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-muted">
          Highlights
          <textarea
            value={summaryEntry.highlights}
            onChange={(event) => setSummaryEntry({ ...summaryEntry, highlights: event.target.value })}
            placeholder="Highlights"
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
          />
        </label>
        <button
          onClick={saveSummary}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Summary
        </button>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Head-to-Head</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Team 1
            <select
              value={h2hEntry.team1_id}
              onChange={(event) => setH2hEntry({ ...h2hEntry, team1_id: event.target.value })}
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
              value={h2hEntry.team2_id}
              onChange={(event) => setH2hEntry({ ...h2hEntry, team2_id: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Team 2</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team 1 Wins
            <input
              type="number"
              value={h2hEntry.team1_wins}
              onChange={(event) => setH2hEntry({ ...h2hEntry, team1_wins: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Team 2 Wins
            <input
              type="number"
              value={h2hEntry.team2_wins}
              onChange={(event) => setH2hEntry({ ...h2hEntry, team2_wins: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            No Result
            <input
              type="number"
              value={h2hEntry.no_result}
              onChange={(event) => setH2hEntry({ ...h2hEntry, no_result: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={saveHeadToHead}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Head-to-Head
        </button>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Player Match Stats</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Player
            <select
              value={statEntry.player_id}
              onChange={(event) => setStatEntry({ ...statEntry, player_id: event.target.value })}
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
              value={statEntry.runs}
              onChange={(event) => setStatEntry({ ...statEntry, runs: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Balls
            <input
              type="number"
              value={statEntry.balls}
              onChange={(event) => setStatEntry({ ...statEntry, balls: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Fours
            <input
              type="number"
              value={statEntry.fours}
              onChange={(event) => setStatEntry({ ...statEntry, fours: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Sixes
            <input
              type="number"
              value={statEntry.sixes}
              onChange={(event) => setStatEntry({ ...statEntry, sixes: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Strike Rate
            <input
              type="number"
              value={statEntry.strike_rate}
              onChange={(event) => setStatEntry({ ...statEntry, strike_rate: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Average
            <input
              type="number"
              value={statEntry.average}
              onChange={(event) => setStatEntry({ ...statEntry, average: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Innings
            <input
              type="number"
              value={statEntry.innings}
              onChange={(event) => setStatEntry({ ...statEntry, innings: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Not Outs
            <input
              type="number"
              value={statEntry.not_outs}
              onChange={(event) => setStatEntry({ ...statEntry, not_outs: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addPlayerStats}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Player Stats
        </button>
        <div className="space-y-2 text-sm">
          {playerStats.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.player?.name ?? "Player"} · {row.runs}/{row.balls}</span>
              <button onClick={() => removePlayerStats(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
