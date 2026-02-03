"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { VenueImage } from "@/lib/types";

export default function AdminVenueEdit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<VenueImage[]>([]);
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    capacity: 0,
    pitch_type: "",
    average_score: "",
    image: ""
  });
  const [imageEntry, setImageEntry] = useState({
    image_url: "",
    caption: ""
  });

  const load = async () => {
    const [venueRes, imagesRes] = await Promise.all([
      supabase.from("venues").select("*").eq("id", params.id).single(),
      supabase.from("venue_images").select("*").eq("venue_id", params.id)
    ]);
    const data = venueRes.data;
    if (data) {
      setForm({
        name: data.name ? "",
        city: data.city ? "",
        country: data.country ? "",
        capacity: data.capacity ? 0,
        pitch_type: data.pitch_type ? "",
        average_score: data.average_score ? "",
        image: data.image ? ""
      });
    }
    setImages((imagesRes.data ? []) as VenueImage[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const save = async () => {
    await supabase.from("venues").update(form).eq("id", params.id);
    router.refresh();
  };

  const remove = async () => {
    await supabase.from("venues").delete().eq("id", params.id);
    router.replace("/admin/venues");
  };

  const addImage = async () => {
    await supabase.from("venue_images").insert({
      venue_id: params.id,
      ...imageEntry
    });
    setImageEntry({ image_url: "", caption: "" });
    load();
  };

  const removeImage = async (id: string) => {
    await supabase.from("venue_images").delete().eq("id", id);
    load();
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading venue...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-[var(--font-sora)] text-lg">Edit Venue</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Name", key: "name", placeholder: "Venue Name" },
            { label: "City", key: "city", placeholder: "City" },
            { label: "Country", key: "country", placeholder: "Country" },
            { label: "Pitch Type", key: "pitch_type", placeholder: "Pitch Type" },
            { label: "Average Score", key: "average_score", placeholder: "Average Score" },
            { label: "Image URL", key: "image", placeholder: "Image URL" }
          ].map((field) => (
            <label key={field.key} className="text-xs uppercase tracking-wide text-muted">
              {field.label}
              <input
                value={(form as any)[field.key]}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                placeholder={field.placeholder}
                className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
              />
            </label>
          ))}
          <label className="text-xs uppercase tracking-wide text-muted">
            Capacity
            <input
              type="number"
              value={form.capacity}
              onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
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
            Delete Venue
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-[var(--font-sora)] text-lg">Gallery Images</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wide text-muted">
            Image URL
            <input
              value={imageEntry.image_url}
              onChange={(event) => setImageEntry({ ...imageEntry, image_url: event.target.value })}
              placeholder="Image URL"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-muted">
            Caption
            <input
              value={imageEntry.caption}
              onChange={(event) => setImageEntry({ ...imageEntry, caption: event.target.value })}
              placeholder="Caption"
              className="mt-2 w-full rounded-xl border border-white/10 bg-cardAlt px-4 py-2 text-sm"
            />
          </label>
        </div>
        <button
          onClick={addImage}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Add Image
        </button>
        <div className="space-y-2 text-sm">
          {images.map((img) => (
            <div key={img.id} className="flex items-center justify-between">
              <span>{img.caption ? "Image"}</span>
              <button onClick={() => removeImage(img.id)} className="text-xs text-danger">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
