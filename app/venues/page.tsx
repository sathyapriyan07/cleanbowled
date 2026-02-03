import Header from "@/components/Header";
import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Venue } from "@/lib/types";

export default async function VenuesPage() {
  const { data } = await supabase.from("venues").select("*").order("name");
  const venues = (data ?? []) as Venue[];

  return (
    <div className="pb-24">
      <Header title="Venues" subtitle="Stadiums and grounds" />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <SectionHeader title="Venues" subtitle="Stadiums and grounds" />
        {venues.length ? (
          venues.map((venue) => (
            <Link key={venue.id} href={`/venues/${venue.id}`}>
              <Card className="flex items-center gap-4">
                <div className="h-16 w-20 overflow-hidden rounded-2xl bg-cardAlt">
                  {venue.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={venue.image} alt={venue.name ?? "Venue"} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <p className="font-[var(--font-sora)] text-base">{venue.name ?? "Venue"}</p>
                  <p className="text-xs text-muted">
                    {venue.city ?? "City"} · {venue.country ?? "Country"}
                  </p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card>No venues added yet.</Card>
        )}
      </div>
    </div>
  );
}
