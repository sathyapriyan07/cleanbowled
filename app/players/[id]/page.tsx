import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import PlayerTabs from "@/components/PlayerTabs";
import { supabase } from "@/lib/supabase";
import { samplePlayers } from "@/lib/sampleData";
import {
  Match,
  Player,
  PlayerCareerStat,
  PlayerGraphPoint,
  PlayerMatchStats,
  PlayerRecord,
  News
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PlayerProfile({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  const { data: matches } = await supabase
    .from("matches")
    .select("*, team1:team1_id(name, logo), team2:team2_id(name, logo), series:series_id(name)")
    .limit(5);

  const { data: stats } = await supabase
    .from("player_match_stats")
    .select("*, match:match_id(*, team1:team1_id(name, logo), team2:team2_id(name, logo), series:series_id(name))")
    .eq("player_id", id)
    .order("created_at", { ascending: false });

  const { data: careerStats } = await supabase
    .from("player_career_stats")
    .select("*")
    .eq("player_id", id)
    .order("format");

  const { data: records } = await supabase
    .from("player_records")
    .select("*")
    .eq("player_id", id)
    .order("created_at", { ascending: false });

  const { data: graphPoints } = await supabase
    .from("player_graph_points")
    .select("*")
    .eq("player_id", id)
    .order("created_at");

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("player_id", id)
    .order("created_at", { ascending: false })
    .limit(6);

  const profile = (player ?? samplePlayers[0]) as Player;
  const matchList = (matches ?? []) as Match[];
  const statList = (stats ?? []) as PlayerMatchStats[];
  const careerList = (careerStats ?? []) as PlayerCareerStat[];
  const recordList = (records ?? []) as PlayerRecord[];
  const graphList = (graphPoints ?? []) as PlayerGraphPoint[];
  const newsList = (news ?? []) as News[];

  const age = profile.dob
    ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="pb-24">
      <Header
        title={profile.name}
        subtitle={`${profile.country ?? "International"} ? ${age ? `${age} yrs` : "Age n/a"}`}
        showBack
        backHref="/players"
        rightSlot={null}
      />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div className="relative overflow-hidden rounded-3xl glass-card-strong p-6 shadow-soft">
          {profile.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.banner}
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
          ) : null}
          <div className="relative max-w-[65%] space-y-2">
            <p className="section-label">Player</p>
            <h2 className="font-[var(--font-sora)] text-2xl">{profile.name}</h2>
            <p className="text-sm text-muted">
              {profile.country ?? "International"} ? {age ? `${age} yrs` : "Age n/a"}
            </p>
          </div>
          <div className="absolute bottom-0 right-3">
            <Avatar src={profile.profile_image ?? undefined} alt={profile.name} size="lg" />
          </div>
        </div>
        <PlayerTabs
          player={profile}
          matches={matchList}
          stats={statList}
          careerStats={careerList}
          records={recordList}
          graphPoints={graphList}
          news={newsList}
        />
      </div>
    </div>
  );
}
