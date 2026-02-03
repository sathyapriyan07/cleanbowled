"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { PlayerComparison, RecordItem, VenueRecord } from "@/lib/types";

export default function AdminStats() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [venues, setVenues] = useState<VenueRecord[]>([]);
  const [comparisons, setComparisons] = useState<PlayerComparison[]>([]);

  const [recordForm, setRecordForm] = useState({
    category: "",
    title: "",
    player_name: "",
    team_name: "",
    value: "",
    format: "",
    season: ""
  });
  const [venueForm, setVenueForm] = useState({
    venue: "",
    category: "",
    title: "",
    value: "",
    season: ""
  });
  const [compareForm, setCompareForm] = useState({
    title: "",
    player1: "",
    player2: "",
    stat1: 0,
    stat2: 0,
    format: ""
  });

  const load = async () => {
    const [recordsRes, venuesRes, comparisonsRes] = await Promise.all([
      supabase.from("records").select("*").order("created_at", { ascending: false }),
      supabase.from("venue_records").select("*").order("created_at", { ascending: false }),
      supabase.from("player_comparisons").select("*").order("created_at", { ascending: false })
    ]);
    setRecords((recordsRes.data ?? []) as RecordItem[]);
    setVenues((venuesRes.data ?? []) as VenueRecord[]);
    setComparisons((comparisonsRes.data ?? []) as PlayerComparison[]);
  };

  useEffect(() => {
    load();
  }, []);

  const addRecord = async () => {
    await supabase.from("records").insert(recordForm);
    setRecordForm({
      category: "",
      title: "",
      player_name: "",
      team_name: "",
      value: "",
      format: "",
      season: ""
    });
    load();
  };

  const addVenue = async () => {
    await supabase.from("venue_records").insert(venueForm);
    setVenueForm({
      venue: "",
      category: "",
      title: "",
      value: "",
      season: ""
    });
    load();
  };

  const addComparison = async () => {
    await supabase.from("player_comparisons").insert(compareForm);
    setCompareForm({
      title: "",
      player1: "",
      player2: "",
      stat1: 0,
      stat2: 0,
      format: ""
    });
    load();
  };

  const removeRecord = async (id: string) => {
    await supabase.from("records").delete().eq("id", id);
    load();
  };
  const removeVenue = async (id: string) => {
    await supabase.from("venue_records").delete().eq("id", id);
    load();
  };
  const removeComparison = async (id: string) => {
    await supabase.from("player_comparisons").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Record</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Category", key: "category", placeholder: "Batting / Bowling" },
            { label: "Title", key: "title", placeholder: "Highest Score" },
            { label: "Player Name", key: "player_name", placeholder: "Player" },
            { label: "Team Name", key: "team_name", placeholder: "Team" },
            { label: "Value", key: "value", placeholder: "Value" },
            { label: "Format", key: "format", placeholder: "T20I / ODI / Test" },
            { label: "Season", key: "season", placeholder: "2025-26" }
          ].map((field) => (
            <label key={field.key} className="text-xs uppercase tracking-wide text-muted">
              {field.label}
              <input
                value={(recordForm as any)[field.key]}
                onChange={(event) => setRecordForm({ ...recordForm, [field.key]: event.target.value })}
                placeholder={field.placeholder}
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
          ))}
        </div>
        <button
          onClick={addRecord}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Record
        </button>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Venue Record</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Venue", key: "venue", placeholder: "Venue" },
            { label: "Category", key: "category", placeholder: "Batting / Bowling" },
            { label: "Title", key: "title", placeholder: "Highest Total" },
            { label: "Value", key: "value", placeholder: "Value" },
            { label: "Season", key: "season", placeholder: "2025-26" }
          ].map((field) => (
            <label key={field.key} className="text-xs uppercase tracking-wide text-muted">
              {field.label}
              <input
                value={(venueForm as any)[field.key]}
                onChange={(event) => setVenueForm({ ...venueForm, [field.key]: event.target.value })}
                placeholder={field.placeholder}
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
          ))}
        </div>
        <button
          onClick={addVenue}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Venue Record
        </button>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Player Comparison</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Title
            <input
              value={compareForm.title}
              onChange={(event) => setCompareForm({ ...compareForm, title: event.target.value })}
              placeholder="Comparison Title"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player 1
            <input
              value={compareForm.player1}
              onChange={(event) => setCompareForm({ ...compareForm, player1: event.target.value })}
              placeholder="Player 1"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Player 2
            <input
              value={compareForm.player2}
              onChange={(event) => setCompareForm({ ...compareForm, player2: event.target.value })}
              placeholder="Player 2"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Stat 1
            <input
              type="number"
              value={compareForm.stat1}
              onChange={(event) => setCompareForm({ ...compareForm, stat1: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Stat 2
            <input
              type="number"
              value={compareForm.stat2}
              onChange={(event) => setCompareForm({ ...compareForm, stat2: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Format
            <input
              value={compareForm.format}
              onChange={(event) => setCompareForm({ ...compareForm, format: event.target.value })}
              placeholder="T20I / ODI / Test"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addComparison}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Comparison
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Records</h3>
        <div className="space-y-2 text-sm">
          {records.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.title ?? "Record"} · {row.value ?? "—"}</span>
              <button onClick={() => removeRecord(row.id)} className="text-xs text-danger">
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Venue Records</h3>
        <div className="space-y-2 text-sm">
          {venues.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.venue ?? "Venue"} · {row.title ?? "Record"}</span>
              <button onClick={() => removeVenue(row.id)} className="text-xs text-danger">
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Comparisons</h3>
        <div className="space-y-2 text-sm">
          {comparisons.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.title ?? "Comparison"} · {row.player1} vs {row.player2}</span>
              <button onClick={() => removeComparison(row.id)} className="text-xs text-danger">
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
