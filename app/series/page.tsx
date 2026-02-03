import Header from "@/components/Header";
import SeriesCard from "@/components/SeriesCard";
import SectionHeader from "@/components/SectionHeader";
import { supabase } from "@/lib/supabase";
import { sampleSeries } from "@/lib/sampleData";
import { Series } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const { data } = await supabase
    .from("series")
    .select("*")
    .eq("is_archived", false)
    .order("start_date", { ascending: false });

  const series = (data?.length ? data : sampleSeries) as Series[];

  return (
    <div className="pb-24">
      <Header title="Series" subtitle="All tournaments and tours" />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <SectionHeader title="Series" subtitle="Active tournaments" />
        <div className="carousel-row">
          {series.map((item) => (
            <div key={item.id} className="carousel-item min-w-[260px]">
              <SeriesCard
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
