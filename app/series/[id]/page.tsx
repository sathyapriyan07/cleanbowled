import Header from "@/components/Header";
import MatchCard from "@/components/MatchCard";
import Tabs from "@/components/Tabs";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import {

export const dynamic = "force-dynamic";
  Match,
  Series,
  SeriesPoint,
  SeriesSquad,
  SeriesStatsLeader
} from "@/lib/types";

export default async function SeriesDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .eq("id", id)
    .single();

  const { data: matches } = await supabase
    .from("matches")
    .select("*, team1:team1_id(name, logo), team2:team2_id(name, logo)")
    .eq("series_id", id)
    .order("date", { ascending: true });

  const { data: points } = await supabase
    .from("series_points")
    .select("*, team:team_id(name, logo)")
    .eq("series_id", id)
    .order("points", { ascending: false });

  const { data: squads } = await supabase
    .from("series_squads")
    .select("*, team:team_id(name), player:player_id(name, profile_image)")
    .eq("series_id", id);

  const { data: leaders } = await supabase
    .from("series_stats_leaders")
    .select("*")
    .eq("series_id", id);

  const seriesData = (series ? {
    id,
    name: "Series Name",
    location: "Location TBC",
    start_date: "TBD",
    end_date: "TBD"
  }) as Series;

  const matchList = (matches ? []) as Match[];
  const pointsTable = (points ? []) as SeriesPoint[];
  const squadsList = (squads ? []) as SeriesSquad[];
  const leadersList = (leaders ? []) as SeriesStatsLeader[];

  return (
    <div className="pb-24">
      <Header
        title={seriesData.name}
        subtitle={`${seriesData.location ? "International"} · ${seriesData.start_date ? "TBD"} - ${seriesData.end_date ? "TBD"}`}
        showBack
        backHref="/series"
      />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="relative overflow-hidden rounded-3xl glass-card-strong p-5">
          {seriesData.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={seriesData.banner}
              alt={seriesData.name}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : null}
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Series</p>
              <p className="font-[var(--font-sora)] text-lg">{seriesData.name}</p>
              <p className="text-xs text-muted">{seriesData.season ? "Season"} · {seriesData.format ? "Format"}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase text-muted">
              {seriesData.is_archived ? "Archived" : "Active"}
            </span>
          </div>
        </div>
        <Tabs
          tabs={[
            {
              label: "Matches",
              content: matchList.length ? (
                <div className="space-y-3">
                  {matchList.map((match) => (
                    <MatchCard
                      key={match.id}
                      id={match.id}
                      team1={match.team1?.name ? "Team One"}
                      team2={match.team2?.name ? "Team Two"}
                      team1Logo={match.team1?.logo ? undefined}
                      team2Logo={match.team2?.logo ? undefined}
                      score1={match.score1 ? undefined}
                      score2={match.score2 ? undefined}
                      result={match.result ? undefined}
                      venue={match.venue ? undefined}
                      date={match.date ? undefined}
                      thumbnail={match.thumbnail ? undefined}
                    />
                  ))}
                </div>
              ) : (
                <Card>No matches added to this series yet.</Card>
              )
            },
            {
              label: "Points",
              content: pointsTable.length ? (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-cardAlt text-left text-muted">
                      <tr>
                        <th className="px-3 py-2">Team</th>
                        <th className="px-3 py-2">P</th>
                        <th className="px-3 py-2">W</th>
                        <th className="px-3 py-2">L</th>
                        <th className="px-3 py-2">NR</th>
                        <th className="px-3 py-2">Pts</th>
                        <th className="px-3 py-2">NRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointsTable.map((row) => (
                        <tr key={row.id} className="border-t border-white/5">
                          <td className="px-3 py-3">{row.team?.name ? "Team"}</td>
                          <td className="px-3 py-3">{row.played}</td>
                          <td className="px-3 py-3">{row.won}</td>
                          <td className="px-3 py-3">{row.lost}</td>
                          <td className="px-3 py-3">{row.no_result}</td>
                          <td className="px-3 py-3">{row.points}</td>
                          <td className="px-3 py-3">{row.net_run_rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Card>No points table yet.</Card>
              )
            },
            {
              label: "Squads",
              content: squadsList.length ? (
                <div className="space-y-3">
                  {squadsList.map((row) => (
                    <Card key={row.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted">{row.team?.name ? "Team"}</p>
                        <p className="font-[var(--font-sora)] text-sm">{row.player?.name ? "Player"}</p>
                      </div>
                      <span className="text-xs text-muted">{row.role ? "Player"}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No squads added yet.</Card>
              )
            },
            {
              label: "Leaders",
              content: leadersList.length ? (
                <div className="space-y-3">
                  {leadersList.map((row) => (
                    <Card key={row.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted">{row.stat_type ? "Stat"}</p>
                        <p className="font-[var(--font-sora)] text-sm">
                          {row.player_name ? "Player"} · {row.team_name ? "Team"}
                        </p>
                      </div>
                      <span className="text-xs text-ink">{row.value ? 0}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No leaders added yet.</Card>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
