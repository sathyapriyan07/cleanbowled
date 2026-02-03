"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";
import { Series } from "@/lib/types";

export default function AdminSeries() {
  const [series, setSeries] = useState<Series[]>([]);
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

  const load = async () => {
    const { data } = await supabase.from("series").select("*").order("start_date", { ascending: false });
    setSeries((data ? []) as Series[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await supabase.from("series").insert(form);
    setForm({
      name: "",
      location: "",
      start_date: "",
      end_date: "",
      season: "",
      format: "",
      is_archived: false,
      banner: ""
    });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("series").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Series</h2>
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
        <button
          onClick={create}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Series
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Series</h3>
        <div className="space-y-2 text-sm">
          {series.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted">{item.location ? "—"}</span>
                <Link href={`/admin/series/${item.id}`} className="text-xs text-ink">
                  Edit
                </Link>
                <button onClick={() => remove(item.id)} className="text-xs text-danger">
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
