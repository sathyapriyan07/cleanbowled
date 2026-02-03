-- Stats & Records module
create table if not exists records (
  id uuid primary key default gen_random_uuid(),
  category text,
  title text,
  player_name text,
  team_name text,
  value text,
  format text,
  season text,
  created_at timestamptz default now()
);

create table if not exists venue_records (
  id uuid primary key default gen_random_uuid(),
  venue text,
  category text,
  title text,
  value text,
  season text,
  created_at timestamptz default now()
);

create table if not exists player_comparisons (
  id uuid primary key default gen_random_uuid(),
  title text,
  player1 text,
  player2 text,
  stat1 numeric(10,2) default 0,
  stat2 numeric(10,2) default 0,
  format text,
  created_at timestamptz default now()
);

create index if not exists idx_records_category on records(category);
create index if not exists idx_records_format on records(format);
create index if not exists idx_venue_records_venue on venue_records(venue);
create index if not exists idx_player_comparisons_format on player_comparisons(format);
