"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Card from "@/components/Card";
import MatchCard from "@/components/MatchCard";
import PlayerCard from "@/components/PlayerCard";
import SeriesCard from "@/components/SeriesCard";
import Avatar from "@/components/Avatar";
import { supabase } from "@/lib/supabase";
import { Match, Player, Series, Team } from "@/lib/types";

const pageSize = 10;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [format, setFormat] = useState("");
  const [year, setYear] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);

  const yearRange = useMemo(() => {
    if (!year) return null;
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
    return { start, end };
  }, [year]);

  const runSearch = async () => {
    setLoading(true);
    const q = query.trim();
    const offset = page * pageSize;

    if (type === "Players") {
      let req = supabase.from("players").select("*").range(offset, offset + pageSize - 1);
      if (q) req = req.or(`name.ilike.%${q}%,country.ilike.%${q}%`);
      if (country) req = req.eq("country", country);
      if (role) req = req.eq("role", role);
      const { data } = await req;
      setPlayers((data ?? []) as Player[]);
      setLoading(false);
      return;
    }

    if (type === "Teams") {
      let req = supabase.from("teams").select("*").range(offset, offset + pageSize - 1);
      if (q) req = req.ilike("name", `%${q}%`);
      const { data } = await req;
      setTeams((data ?? []) as Team[]);
      setLoading(false);
      return;
    }

    if (type === "Matches") {
      let req = supabase
        .from("matches")
        .select("*, team1:team1_id(name, logo), team2:team2_id(name, logo)")
        .range(offset, offset + pageSize - 1);
      if (q) req = req.or(`venue.ilike.%${q}%,result.ilike.%${q}%`);
      if (format) req = req.eq("format", format);
      if (yearRange) req = req.gte("date", yearRange.start).lte("date", yearRange.end);
      const { data } = await req;
      setMatches((data ?? []) as Match[]);
      setLoading(false);
      return;
    }

    if (type === "Series") {
      let req = supabase.from("series").select("*").range(offset, offset + pageSize - 1);
      if (q) req = req.or(`name.ilike.%${q}%,location.ilike.%${q}%`);
      if (format) req = req.eq("format", format);
      if (yearRange) req = req.gte("start_date", yearRange.start).lte("start_date", yearRange.end);
      const { data } = await req;
      setSeries((data ?? []) as Series[]);
      setLoading(false);
      return;
    }

    const [playersRes, teamsRes, matchesRes, seriesRes] = await Promise.all([
      supabase.from("players").select("*").limit(4),
      supabase.from("teams").select("*").limit(4),
      supabase.from("matches").select("*, team1:team1_id(name, logo), team2:team2_id(name, logo)").limit(4),
      supabase.from("series").select("*").limit(4)
    ]);
    setPlayers((playersRes.data ?? []) as Player[]);
    setTeams((teamsRes.data ?? []) as Team[]);
    setMatches((matchesRes.data ?? []) as Match[]);
    setSeries((seriesRes.data ?? []) as Series[]);
    setLoading(false);
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page]);

  return (
    <div className="pb-24">
      <Header title="Search" subtitle="Players, teams, matches, series" />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <Card className="space-y-3 sticky top-3 z-20">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, team, venue..."
            className="w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm text-ink"
          />
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-xs uppercase tracking-wide text-muted">
              Type
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              >
                {["All", "Players", "Teams", "Matches", "Series"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-muted">
              Format
              <input
                value={format}
                onChange={(event) => setFormat(event.target.value)}
                placeholder="T20I / ODI / Test"
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-muted">
              Year
              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2026"
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-muted">
              Country
              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="India"
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-muted">
              Role
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Batter / Bowler"
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
            <button
              onClick={() => {
                setPage(0);
                runSearch();
              }}
              className="mt-6 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>
        </Card>

        {loading ? <Card className="skeleton">Loading results...</Card> : null}

        {type === "Players" || type === "All" ? (
          <div className="space-y-3">
            <h3 className="font-[var(--font-sora)] text-lg">Players</h3>
            {players.length ? (
              players.map((player) => (
                <PlayerCard
                  key={player.id}
                  id={player.id}
                  name={player.name}
                  role={player.role}
                  country={player.country}
                  image={player.profile_image}
                />
              ))
            ) : (
              <Card>No players found.</Card>
            )}
          </div>
        ) : null}

        {type === "Teams" || type === "All" ? (
          <div className="space-y-3">
            <h3 className="font-[var(--font-sora)] text-lg">Teams</h3>
            {teams.length ? (
              teams.map((team) => (
                <Link key={team.id} href={`/teams/${team.id}`}>
                  <Card className="flex items-center gap-4">
                    <Avatar src={team.logo ?? undefined} alt={team.name} size="md" />
                    <div>
                      <p className="font-[var(--font-sora)] text-base">{team.name}</p>
                      <p className="text-xs text-muted">
                        Captain: {team.captain ?? "TBD"} · Coach: {team.coach ?? "TBD"}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>No teams found.</Card>
            )}
          </div>
        ) : null}

        {type === "Matches" || type === "All" ? (
          <div className="space-y-3">
            <h3 className="font-[var(--font-sora)] text-lg">Matches</h3>
            {matches.length ? (
              matches.map((match) => (
                <MatchCard
                  key={match.id}
                  id={match.id}
                  team1={match.team1?.name ?? "Team One"}
                  team2={match.team2?.name ?? "Team Two"}
                  team1Logo={match.team1?.logo ?? undefined}
                  team2Logo={match.team2?.logo ?? undefined}
                  score1={match.score1 ?? undefined}
                  score2={match.score2 ?? undefined}
                  result={match.result ?? undefined}
                  venue={match.venue ?? undefined}
                  date={match.date ?? undefined}
                  thumbnail={match.thumbnail ?? undefined}
                />
              ))
            ) : (
              <Card>No matches found.</Card>
            )}
          </div>
        ) : null}

        {type === "Series" || type === "All" ? (
          <div className="space-y-3">
            <h3 className="font-[var(--font-sora)] text-lg">Series</h3>
            {series.length ? (
              series.map((item) => (
                <SeriesCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  banner={item.banner ?? undefined}
                  location={item.location ?? undefined}
                  dates={
                    item.start_date && item.end_date
                      ? `${item.start_date} · ${item.end_date}`
                      : undefined
                  }
                />
              ))
            ) : (
              <Card>No series found.</Card>
            )}
          </div>
        ) : null}

        {type !== "All" ? (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs text-muted"
            >
              Previous
            </button>
            <span className="text-xs text-muted">Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs text-muted"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
