import Header from "@/components/Header";
import PlayersGrid from "@/components/PlayersGrid";
import SectionHeader from "@/components/SectionHeader";
import { supabase } from "@/lib/supabase";
import { samplePlayers } from "@/lib/sampleData";
import { Player } from "@/lib/types";

export default async function Players() {
  const { data } = await supabase.from("players").select("*").order("name");

  const players = (data?.length ? data : samplePlayers) as Player[];

  return (
    <div className="pb-24">
      <Header title="Players" subtitle="Search and explore player profiles" />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <SectionHeader title="All Players" subtitle="Updated by admin" />
        <div className="mt-4">
          <PlayersGrid players={players} />
        </div>
      </div>
    </div>
  );
}
