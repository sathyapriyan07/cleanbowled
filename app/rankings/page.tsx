import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { Ranking } from "@/lib/types";

export const dynamic = "force-dynamic";

const formats = ["All", "T20I", "ODI", "Test", "IPL"];
const categories = ["Teams", "Batting", "Bowling"];

export default async function RankingsPage() {
  const { data } = await supabase.from("rankings").select("*").order("rank", { ascending: true });
  const rankings = (data ? []) as Ranking[];

  const formatTabs = formats.map((format) => ({
    label: format,
    content: (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-white/10 px-3 py-1 text-muted"
            >
              {category}
            </span>
          ))}
        </div>
        {rankings.length ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-cardAlt text-left text-muted">
                <tr>
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Team</th>
                  <th className="px-3 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {rankings
                  .filter((row) => format === "All" || row.format === format)
                  .map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-t border-white/5 ${index < 3 ? "bg-white/5" : ""}`}
                    >
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${index < 3 ? "bg-accent/20 text-ink" : "text-muted"}`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3">{row.name ? "—"}</td>
                      <td className="px-3 py-3">{row.team ? "—"}</td>
                      <td className="px-3 py-3">{row.rating ? 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card>No rankings yet.</Card>
        )}
      </div>
    )
  }));

  return (
    <div className="pb-24">
      <Header title="Rankings" subtitle="Static rankings updated by admin" />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Tabs tabs={formatTabs} />
      </div>
    </div>
  );
}
