type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20"
};

export default function Avatar({ src, alt, size = "md" }: AvatarProps) {
  return (
    <div className={`overflow-hidden rounded-full bg-cardAlt ${sizeMap[size]}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted">
          {alt.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
