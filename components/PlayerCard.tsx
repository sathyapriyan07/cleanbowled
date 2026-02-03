import Link from "next/link";
import Avatar from "./Avatar";
import Card from "./Card";

type PlayerCardProps = {
  id: string;
  name: string;
  role?: string | null;
  country?: string | null;
  image?: string | null;
};

export default function PlayerCard({ id, name, role, country, image }: PlayerCardProps) {
  return (
    <Link href={`/players/${id}`} className="block">
      <Card className="flex items-center gap-4">
        <Avatar src={image ?? undefined} alt={name} size="md" />
        <div>
          <p className="font-[var(--font-sora)] text-base">{name}</p>
          <p className="text-xs text-muted">{role ?? "All-rounder"} · {country ?? "—"}</p>
        </div>
      </Card>
    </Link>
  );
}
