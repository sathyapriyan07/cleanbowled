type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: string;
};

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="font-[var(--font-sora)] text-lg">{title}</h2>
        {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
      </div>
      {action ? <span className="text-xs text-muted">{action}</span> : null}
    </div>
  );
}
