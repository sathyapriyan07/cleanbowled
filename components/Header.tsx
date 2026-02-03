import Link from "next/link";
import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  showBack?: boolean;
  backHref?: string;
};

export default function Header({
  title,
  subtitle,
  rightSlot,
  showBack,
  backHref = "/"
}: HeaderProps) {
  return (
    <div className="rounded-b-[28px] bg-navy-gradient px-4 pb-10 pt-6 shadow-soft">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="text-sm font-semibold text-ink">
          Clean<span className="text-muted">Bowled</span>
        </div>
        {rightSlot === null ? null : (
          rightSlot ? (
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="rounded-full bg-cardAlt px-4 py-1 text-xs text-muted shadow-soft"
              >
                Search
              </Link>
            </div>
          )
        )}
      </div>
      <div className="mx-auto mt-6 max-w-4xl">
        {showBack ? (
          <Link href={backHref} className="inline-flex items-center gap-2 text-xs text-muted">
            <span className="text-lg">←</span>
            Back
          </Link>
        ) : null}
        <h1 className="mt-3 font-[var(--font-sora)] text-2xl font-semibold text-ink">
          {title}
        </h1>
        {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
}
