import Header from "@/components/Header";
import MatchCard from "@/components/MatchCard";
import SeriesCard from "@/components/SeriesCard";
import SectionHeader from "@/components/SectionHeader";
import { supabase } from "@/lib/supabase";
import { sampleMatches, sampleSeries } from "@/lib/sampleData";
import { Match, Series } from "@/lib/types";

export default async function Home() {
  const { data: matches } = await supabase
    .from("matches")
    .select("*, team1:team1_id(name, logo), team2:team2_id(name, logo)")
    .order("date", { ascending: false });

  const { data: series } = await supabase
    .from("series")
    .select("*")
    .order("start_date", { ascending: false });

  const matchList = (matches?.length ? matches : sampleMatches) as Match[];
  const seriesList = (series?.length ? series : sampleSeries) as Series[];

  return (
    <div className="pb-24">
      <Header title="Match Center" subtitle="Latest results and upcoming series" />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <section className="space-y-4">
          <SectionHeader title="Recent Matches" subtitle="Updated by Admin" />
          <div className="carousel-row">
            {matchList.map((match) => (
              <div key={match.id} className="carousel-item min-w-[280px]">
                <MatchCard
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
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Trending Series" subtitle="Manual schedule" />
          <div className="carousel-row">
            {seriesList.map((item) => (
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
        </section>
      </div>
    </div>
  );
}
