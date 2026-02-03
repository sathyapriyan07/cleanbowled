"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Venue } from "@/lib/types";

export default function AdminVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    capacity: 0,
    pitch_type: "",
    average_score: "",
    image: ""
  });

  const load = async () => {
    const { data } = await supabase.from("venues").select("*").order("name");
    setVenues((data ? []) as Venue[]);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await supabase.from("venues").insert(form);
    setForm({
      name: "",
      city: "",
      country: "",
      capacity: 0,
      pitch_type: "",
      average_score: "",
      image: ""
    });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("venues").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Add Venue</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Venue Name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            City
            <input
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
              placeholder="City"
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
            Capacity
            <input
              type="number"
              value={form.capacity}
              onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Pitch Type
            <input
              value={form.pitch_type}
              onChange={(event) => setForm({ ...form, pitch_type: event.target.value })}
              placeholder="Pitch Type"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Average Score
            <input
              value={form.average_score}
              onChange={(event) => setForm({ ...form, average_score: event.target.value })}
              placeholder="Average Score"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Image URL
            <input
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              placeholder="Image URL"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={create}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Save Venue
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-[var(--font-sora)] text-lg">Venues</h3>
        <div className="space-y-2 text-sm">
          {venues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between">
              <span>{venue.name ? "Venue"} · {venue.city ? "City"}</span>
              <div className="flex items-center gap-3">
                <a href={`/admin/venues/${venue.id}`} className="text-xs text-ink">
                  Edit
                </a>
                <button onClick={() => remove(venue.id)} className="text-xs text-danger">
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
