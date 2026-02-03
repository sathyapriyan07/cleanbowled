-- Rankings module (static)
create table if not exists rankings (
  id uuid primary key default gen_random_uuid(),
  category text,
  format text,
  rank integer default 0,
  name text,
  team text,
  rating numeric(8,2) default 0,
  created_at timestamptz default now()
);

create index if not exists idx_rankings_category on rankings(category);
create index if not exists idx_rankings_format on rankings(format);
