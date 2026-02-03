"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { PlayerCareerStat, PlayerGraphPoint, PlayerRecord } from "@/lib/types";

export default function AdminPlayerEdit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [careerStats, setCareerStats] = useState<PlayerCareerStat[]>([]);
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [graphPoints, setGraphPoints] = useState<PlayerGraphPoint[]>([]);
  const [form, setForm] = useState({
    name: "",
    country: "",
    role: "",
    batting_style: "",
    bowling_style: "",
    height: "",
    dob: "",
    bio: "",
    profile_image: "",
    banner: ""
  });

  useEffect(() => {
    const load = async () => {
      const [playerRes, careerRes, recordRes, graphRes] = await Promise.all([
        supabase.from("players").select("*").eq("id", params.id).single(),
        supabase.from("player_career_stats").select("*").eq("player_id", params.id),
        supabase.from("player_records").select("*").eq("player_id", params.id),
        supabase.from("player_graph_points").select("*").eq("player_id", params.id)
      ]);
      const data = playerRes.data;
      if (data) {
        setForm({
          name: data.name ?? "",
          country: data.country ?? "",
          role: data.role ?? "",
          batting_style: data.batting_style ?? "",
          bowling_style: data.bowling_style ?? "",
          height: data.height ?? "",
          dob: data.dob ?? "",
          bio: data.bio ?? "",
          profile_image: data.profile_image ?? "",
          banner: data.banner ?? ""
        });
      }
      setCareerStats((careerRes.data ?? []) as PlayerCareerStat[]);
      setRecords((recordRes.data ?? []) as PlayerRecord[]);
      setGraphPoints((graphRes.data ?? []) as PlayerGraphPoint[]);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const save = async () => {
    await supabase.from("players").update(form).eq("id", params.id);
    router.refresh();
  };

  const remove = async () => {
    await supabase.from("players").delete().eq("id", params.id);
    router.replace("/admin/players");
  };

  const [careerEntry, setCareerEntry] = useState({
    format: "",
    matches: 0,
    innings: 0,
    runs: 0,
    highest_score: 0,
    hundreds: 0,
    fifties: 0,
    strike_rate: 0,
    average: 0
  });
  const [recordEntry, setRecordEntry] = useState({
    title: "",
    value: "",
    description: ""
  });
  const [graphEntry, setGraphEntry] = useState({
    format: "",
    label: "",
    value: 0
  });

  const addCareer = async () => {
    await supabase.from("player_career_stats").insert({
      player_id: params.id,
      ...careerEntry
    });
    setCareerEntry({
      format: "",
      matches: 0,
      innings: 0,
      runs: 0,
      highest_score: 0,
      hundreds: 0,
      fifties: 0,
      strike_rate: 0,
      average: 0
    });
    router.refresh();
  };

  const addRecord = async () => {
    await supabase.from("player_records").insert({
      player_id: params.id,
      ...recordEntry
    });
    setRecordEntry({ title: "", value: "", description: "" });
    router.refresh();
  };

  const addGraph = async () => {
    await supabase.from("player_graph_points").insert({
      player_id: params.id,
      ...graphEntry
    });
    setGraphEntry({ format: "", label: "", value: 0 });
    router.refresh();
  };

  const removeCareer = async (id: string) => {
    await supabase.from("player_career_stats").delete().eq("id", id);
    router.refresh();
  };

  const removeRecord = async (id: string) => {
    await supabase.from("player_records").delete().eq("id", id);
    router.refresh();
  };

  const removeGraph = async (id: string) => {
    await supabase.from("player_graph_points").delete().eq("id", id);
    router.refresh();
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading player...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Edit Player</h2>
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
            Height
            <input
              value={form.height}
              onChange={(event) => setForm({ ...form, height: event.target.value })}
              placeholder="Height"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Date of Birth
            <input
              value={form.dob}
              onChange={(event) => setForm({ ...form, dob: event.target.value })}
              placeholder="Date of Birth"
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
            Delete Player
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Career Stats</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Format
            <select
              value={careerEntry.format}
              onChange={(event) => setCareerEntry({ ...careerEntry, format: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Select Format</option>
              {["Test", "ODI", "T20I", "IPL", "BBL", "SA20", "MLC"].map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Matches
            <input
              type="number"
              value={careerEntry.matches}
              onChange={(event) => setCareerEntry({ ...careerEntry, matches: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Innings
            <input
              type="number"
              value={careerEntry.innings}
              onChange={(event) => setCareerEntry({ ...careerEntry, innings: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Runs
            <input
              type="number"
              value={careerEntry.runs}
              onChange={(event) => setCareerEntry({ ...careerEntry, runs: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Highest Score
            <input
              type="number"
              value={careerEntry.highest_score}
              onChange={(event) => setCareerEntry({ ...careerEntry, highest_score: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Hundreds
            <input
              type="number"
              value={careerEntry.hundreds}
              onChange={(event) => setCareerEntry({ ...careerEntry, hundreds: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Fifties
            <input
              type="number"
              value={careerEntry.fifties}
              onChange={(event) => setCareerEntry({ ...careerEntry, fifties: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Strike Rate
            <input
              type="number"
              value={careerEntry.strike_rate}
              onChange={(event) => setCareerEntry({ ...careerEntry, strike_rate: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Average
            <input
              type="number"
              value={careerEntry.average}
              onChange={(event) => setCareerEntry({ ...careerEntry, average: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addCareer}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Career Stats
        </button>
        <div className="space-y-2 text-sm">
          {careerStats.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.format ?? "Format"} · {row.runs} runs</span>
              <button onClick={() => removeCareer(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Records</h3>
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
              <span>{row.title ?? "Record"} · {row.value ?? ""}</span>
              <button onClick={() => removeRecord(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Career Graph Points</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Format
            <select
              value={graphEntry.format}
              onChange={(event) => setGraphEntry({ ...graphEntry, format: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            >
              <option value="">Select Format</option>
              {["Test", "ODI", "T20I", "IPL", "BBL", "SA20", "MLC"].map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Label
            <input
              value={graphEntry.label}
              onChange={(event) => setGraphEntry({ ...graphEntry, label: event.target.value })}
              placeholder="Label"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Value
            <input
              type="number"
              value={graphEntry.value}
              onChange={(event) => setGraphEntry({ ...graphEntry, value: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addGraph}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Graph Point
        </button>
        <div className="space-y-2 text-sm">
          {graphPoints.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <span>{row.label ?? "Point"} · {row.value ?? 0}</span>
              <button onClick={() => removeGraph(row.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
