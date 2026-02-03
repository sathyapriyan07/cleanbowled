import Link from "next/link";
import Card from "./Card";

type MatchCardProps = {
  id: string;
  team1: string;
  team2: string;
  team1Logo?: string | null;
  team2Logo?: string | null;
  score1?: string | null;
  score2?: string | null;
  result?: string | null;
  date?: string | null;
  venue?: string | null;
  thumbnail?: string | null;
};

export default function MatchCard({
  id,
  team1,
  team2,
  team1Logo,
  team2Logo,
  score1,
  score2,
  result,
  date,
  venue,
  thumbnail
}: MatchCardProps) {
  return (
    <Link href={`/matches/${id}`} className="block">
      <Card className="flex gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-cardAlt">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt={team1} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted">{date ?? "TBD"} · {venue ?? "Venue TBC"}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-full bg-cardAlt">
                {team1Logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={team1Logo} alt={team1} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <p className="font-[var(--font-sora)] text-sm">{team1}</p>
            </div>
            <span className="text-xs text-muted">vs</span>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-full bg-cardAlt">
                {team2Logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={team2Logo} alt={team2} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <p className="font-[var(--font-sora)] text-sm">{team2}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span>{score1 ?? "—"} / {score2 ?? "—"}</span>
            <span className="text-success">{result ?? "Awaiting result"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
