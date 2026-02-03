import Header from "@/components/Header";
import MatchCard from "@/components/MatchCard";
import SectionHeader from "@/components/SectionHeader";
import { supabase } from "@/lib/supabase";
import { sampleMatches } from "@/lib/sampleData";
import { Match } from "@/lib/types";

export default async function MatchesPage() {
  const { data } = await supabase
    .from("matches")
    .select("*, team1:team1_id(name), team2:team2_id(name)")
    .order("date", { ascending: false });

  const matches = (data?.length ? data : sampleMatches) as Match[];

  return (
    <div className="pb-24">
      <Header title="Matches" subtitle="Results and upcoming fixtures" />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <SectionHeader title="All Matches" subtitle="Updated by admin" />
        <div className="carousel-row">
          {matches.map((match) => (
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
      </div>
    </div>
  );
}
