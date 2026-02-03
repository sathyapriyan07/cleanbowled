import Link from "next/link";
import Card from "./Card";

type SeriesCardProps = {
  id: string;
  name: string;
  location?: string | null;
  dates?: string | null;
  banner?: string | null;
};

export default function SeriesCard({ id, name, location, dates, banner }: SeriesCardProps) {
  return (
    <Link href={`/series/${id}`} className="block">
      <Card className="flex items-center gap-4">
        <div className="h-20 w-24 overflow-hidden rounded-2xl bg-cardAlt">
          {banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={banner} alt={name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <p className="font-[var(--font-sora)] text-base">{name}</p>
          <p className="text-xs text-muted">{location ?? "International"} · {dates ?? "TBD"}</p>
        </div>
      </Card>
    </Link>
  );
}
