import Header from "@/components/Header";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Venue, VenueImage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function VenueDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: venue } = await supabase.from("venues").select("*").eq("id", id).single();
  const { data: images } = await supabase.from("venue_images").select("*").eq("venue_id", id);

  const venueData = (venue ? { id, name: "Venue" }) as Venue;
  const imageList = (images ? []) as VenueImage[];

  return (
    <div className="pb-24">
      <Header
        title={venueData.name ? "Venue"}
        subtitle={`${venueData.city ? "City"} · ${venueData.country ? "Country"}`}
        showBack
        backHref="/venues"
      />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted">Capacity</p>
          <p className="font-[var(--font-sora)] text-lg">{venueData.capacity ? 0}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted">Pitch Type</p>
          <p className="text-sm text-ink">{venueData.pitch_type ? "TBD"}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted">Average Score</p>
          <p className="text-sm text-ink">{venueData.average_score ? "TBD"}</p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-muted">Gallery</p>
          {imageList.length ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {imageList.map((img) => (
                <div key={img.id} className="overflow-hidden rounded-xl bg-cardAlt">
                  {img.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.image_url} alt={img.caption ? "Venue"} className="h-32 w-full object-cover" />
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">No images added yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
