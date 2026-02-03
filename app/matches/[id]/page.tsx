import Header from "@/components/Header";
import MatchTabs from "@/components/MatchTabs";
import { supabase } from "@/lib/supabase";
import {
  Match,
  MatchBatting,
  MatchBowling,
  MatchFallOfWicket,
  MatchHeadToHead,
  MatchPartnership,
  MatchSummary,
  PlayingXI,
  News
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MatchDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: match } = await supabase
    .from("matches")
    .select("*, series:series_id(name), team1:team1_id(name, logo), team2:team2_id(name, logo), toss_winner:toss_winner_id(name), player_of_match:player_of_match_id(name, profile_image)")
    .eq("id", id)
    .single();

  const { data: batting } = await supabase
    .from("match_batting")
    .select("*, player:player_id(name)")
    .eq("match_id", id);

  const { data: bowling } = await supabase
    .from("match_bowling")
    .select("*, player:player_id(name)")
    .eq("match_id", id);

  const { data: playingXI } = await supabase
    .from("match_playing_xi")
    .select("*, player:player_id(name, profile_image, role), team:team_id(name)")
    .eq("match_id", id);

  const { data: partnerships } = await supabase
    .from("match_partnerships")
    .select("*, team:team_id(name)")
    .eq("match_id", id);

  const { data: fallOfWickets } = await supabase
    .from("match_fall_of_wickets")
    .select("*, team:team_id(name)")
    .eq("match_id", id);

  const { data: summary } = await supabase
    .from("match_summary")
    .select("*")
    .eq("match_id", id)
    .maybeSingle();

  const { data: headToHead } = await supabase
    .from("match_head_to_head")
    .select("*, team1:team1_id(name), team2:team2_id(name)")
    .eq("match_id", id)
    .maybeSingle();

  const { data: relatedNews } = await supabase
    .from("news")
    .select("*")
    .eq("match_id", id)
    .order("created_at", { ascending: false })
    .limit(4);

  const matchData = (match ?? {
    id,
    team1: { name: "Team One" },
    team2: { name: "Team Two" },
    venue: "Venue TBC",
    date: "Date TBC"
  }) as Match;

  return (
    <div className="pb-24">
      <Header
        title={`${matchData.team1?.name ?? "Team One"} vs ${matchData.team2?.name ?? "Team Two"}`}
        subtitle={matchData.result ?? "Match center"}
        showBack
        backHref="/matches"
      />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="relative mb-6 overflow-hidden rounded-3xl glass-card-strong p-5">
          {matchData.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={matchData.thumbnail}
              alt={matchData.team1?.name ?? "Match"}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : null}
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Score</p>
              <p className="font-[var(--font-sora)] text-lg">
                {matchData.score1 ?? "?"} ? {matchData.score2 ?? "?"}
              </p>
              <p className="text-xs text-muted">{matchData.venue ?? "Venue"} ? {matchData.date ?? "Date"}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase text-muted">
              {matchData.status ?? "Scheduled"}
            </span>
          </div>
        </div>
        <MatchTabs
          match={matchData}
          batting={(batting ?? []) as MatchBatting[]}
          bowling={(bowling ?? []) as MatchBowling[]}
          playingXI={(playingXI ?? []) as PlayingXI[]}
          partnerships={(partnerships ?? []) as MatchPartnership[]}
          fallOfWickets={(fallOfWickets ?? []) as MatchFallOfWicket[]}
          summary={(summary ?? null) as MatchSummary | null}
          headToHead={(headToHead ?? null) as MatchHeadToHead | null}
          relatedNews={(relatedNews ?? []) as News[]}
        />
      </div>
    </div>
  );
}
