import Header from "@/components/Header";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Team } from "@/lib/types";

export default async function TeamsPage() {
  const { data } = await supabase.from("teams").select("*").order("name");
  const teams = (data ?? []) as Team[];

  return (
    <div className="pb-24">
      <Header title="Teams" subtitle="All teams and squads" />
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <SectionHeader title="Teams" subtitle="Squads and staff" />
        {teams.length ? (
          <div className="carousel-row">
            {teams.map((team) => (
              <div key={team.id} className="carousel-item min-w-[260px]">
                <Link href={`/teams/${team.id}`}>
                  <Card className="flex items-center gap-4">
                    <Avatar src={team.logo ?? undefined} alt={team.name} size="md" />
                    <div>
                      <p className="font-[var(--font-sora)] text-base">{team.name}</p>
                      <p className="text-xs text-muted">
                        Captain: {team.captain ?? "TBD"} · Coach: {team.coach ?? "TBD"}
                      </p>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <Card>No teams added yet.</Card>
        )}
      </div>
    </div>
  );
}
