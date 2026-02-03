"use client";

import { useMemo, useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/lib/types";

type PlayersGridProps = {
  players: Player[];
};

export default function PlayersGrid({ players }: PlayersGridProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");

  const filtered = useMemo(() => {
    return players.filter((player) => {
      const matchQuery = player.name.toLowerCase().includes(query.toLowerCase());
      const matchRole = role === "All" || player.role === role;
      return matchQuery && matchRole;
    });
  }, [players, query, role]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search players"
          className="w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm text-ink outline-none"
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm text-ink md:w-56"
        >
          <option>All</option>
          <option>Top-order Batter</option>
          <option>All-rounder</option>
          <option>Fast Bowler</option>
          <option>Spinner</option>
          <option>Wicket Keeper</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length ? (
          filtered.map((player) => (
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
          <div className="rounded-xl border border-white/10 p-6 text-sm text-muted">
            No players match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
