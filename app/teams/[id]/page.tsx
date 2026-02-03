import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import { supabase } from "@/lib/supabase";
import {

export const dynamic = "force-dynamic";
  Team,
  TeamRecord,
  TeamSquad,
  TeamTrophy,
  TeamVenuePerformance
} from "@/lib/types";

export default async function TeamDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: team } = await supabase.from("teams").select("*").eq("id", id).single();
  const { data: squads } = await supabase
    .from("team_squads")
    .select("*, player:player_id(name, profile_image)")
    .eq("team_id", id);
  const { data: records } = await supabase.from("team_records").select("*").eq("team_id", id);
  const { data: trophies } = await supabase.from("team_trophies").select("*").eq("team_id", id);
  const { data: venuePerf } = await supabase
    .from("team_venue_performance")
    .select("*")
    .eq("team_id", id);

  const teamData = (team ? { id, name: "Team", logo: null }) as Team;
  const squadList = (squads ? []) as TeamSquad[];
  const recordList = (records ? []) as TeamRecord[];
  const trophyList = (trophies ? []) as TeamTrophy[];
  const venueList = (venuePerf ? []) as TeamVenuePerformance[];

  return (
    <div className="pb-24">
      <Header
        title={teamData.name}
        subtitle={`Captain: ${teamData.captain ? "TBD"} · Coach: ${teamData.coach ? "TBD"}`}
        showBack
        backHref="/teams"
      />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="relative overflow-hidden rounded-3xl bg-card-gradient p-6 shadow-soft">
          {teamData.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={teamData.banner}
              alt={teamData.name}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : null}
          <div className="relative flex items-center gap-4">
            <Avatar src={teamData.logo ? undefined} alt={teamData.name} size="lg" />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Team</p>
              <h2 className="font-[var(--font-sora)] text-2xl">{teamData.name}</h2>
            </div>
          </div>
        </div>

        <Tabs
          tabs={[
            {
              label: "Overview",
              content: (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <p className="text-xs text-muted">Captain</p>
                    <p className="font-[var(--font-sora)] text-lg">{teamData.captain ? "TBD"}</p>
                  </Card>
                  <Card>
                    <p className="text-xs text-muted">Coach</p>
                    <p className="font-[var(--font-sora)] text-lg">{teamData.coach ? "TBD"}</p>
                  </Card>
                </div>
              )
            },
            {
              label: "Squad",
              content: squadList.length ? (
                <div className="space-y-3">
                  {squadList.map((row) => (
                    <Card key={row.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar src={row.player?.profile_image ? undefined} alt={row.player?.name ? "Player"} size="sm" />
                        <div>
                          <p className="text-sm">{row.player?.name ? "Player"}</p>
                          <p className="text-xs text-muted">{row.role ? "Player"}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No squad added yet.</Card>
              )
            },
            {
              label: "Records",
              content: recordList.length ? (
                <div className="space-y-3">
                  {recordList.map((row) => (
                    <Card key={row.id}>
                      <p className="text-xs uppercase tracking-wide text-muted">{row.title ? "Record"}</p>
                      <p className="font-[var(--font-sora)] text-base">{row.value ? ""}</p>
                      {row.description ? <p className="mt-2 text-sm text-muted">{row.description}</p> : null}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No records added yet.</Card>
              )
            },
            {
              label: "Trophies",
              content: trophyList.length ? (
                <div className="space-y-3">
                  {trophyList.map((row) => (
                    <Card key={row.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-[var(--font-sora)] text-base">{row.title ? "Trophy"}</p>
                        <p className="text-xs text-muted">{row.description ? ""}</p>
                      </div>
                      <span className="text-xs text-muted">{row.year ? "—"}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No trophies added yet.</Card>
              )
            },
            {
              label: "Venues",
              content: venueList.length ? (
                <div className="space-y-3">
                  {venueList.map((row) => (
                    <Card key={row.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-[var(--font-sora)] text-base">{row.venue ? "Venue"}</p>
                        <p className="text-xs text-muted">
                          Matches {row.matches} · Wins {row.wins} · Losses {row.losses}
                        </p>
                      </div>
                      <span className="text-xs text-muted">NR {row.no_result}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No venue performance added yet.</Card>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
