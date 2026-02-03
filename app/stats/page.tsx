import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { PlayerComparison, RecordItem, VenueRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const formats = ["All", "T20I", "ODI", "Test", "IPL"];
const categories = ["Batting", "Bowling", "Fielding", "Team"];

export default async function StatsPage() {
  const { data: records } = await supabase.from("records").select("*").order("created_at", { ascending: false });
  const { data: venueRecords } = await supabase.from("venue_records").select("*").order("created_at", { ascending: false });
  const { data: comparisons } = await supabase.from("player_comparisons").select("*").order("created_at", { ascending: false });

  const recordList = (records ? []) as RecordItem[];
  const venueList = (venueRecords ? []) as VenueRecord[];
  const comparisonList = (comparisons ? []) as PlayerComparison[];

  return (
    <div className="pb-24">
      <Header title="Stats & Records" subtitle="Static stats updated by admin" />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Tabs
          tabs={[
            {
              label: "Records",
              content: (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                    {formats.map((format) => (
                      <span key={format} className="rounded-full border border-white/10 px-3 py-1 text-muted">
                        {format}
                      </span>
                    ))}
                  </div>
                  {recordList.length ? (
                    <div className="space-y-3">
                      {recordList.map((row) => (
                        <Card key={row.id}>
                          <p className="text-xs uppercase tracking-wide text-muted">{row.category ? "Record"}</p>
                          <p className="font-[var(--font-sora)] text-base">{row.title ? "Title"}</p>
                          <p className="text-sm text-muted">
                            {row.player_name ? "Player"} · {row.team_name ? "Team"}
                          </p>
                          <p className="mt-2 text-sm text-ink">{row.value ? "—"}</p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>No records yet.</Card>
                  )}
                </div>
              )
            },
            {
              label: "Venue Records",
              content: venueList.length ? (
                <div className="space-y-3">
                  {venueList.map((row) => (
                    <Card key={row.id}>
                      <p className="text-xs uppercase tracking-wide text-muted">{row.venue ? "Venue"}</p>
                      <p className="font-[var(--font-sora)] text-base">{row.title ? "Title"}</p>
                      <p className="text-sm text-muted">{row.category ? "Category"}</p>
                      <p className="mt-2 text-sm text-ink">{row.value ? "—"}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No venue records yet.</Card>
              )
            },
            {
              label: "Compare",
              content: comparisonList.length ? (
                <div className="space-y-3">
                  {comparisonList.map((row) => (
                    <Card key={row.id} className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted">{row.title ? "Comparison"}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>{row.player1 ? "Player 1"}</span>
                        <span className="font-[var(--font-sora)]">{row.stat1 ? 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{row.player2 ? "Player 2"}</span>
                        <span className="font-[var(--font-sora)]">{row.stat2 ? 0}</span>
                      </div>
                      <p className="text-xs text-muted">{row.format ? "Format"}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>No comparisons yet.</Card>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
