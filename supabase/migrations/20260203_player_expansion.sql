-- Player expansion: career stats, records, graphs, banner
alter table if exists players
  add column if not exists banner text;

create table if not exists player_career_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  format text,
  matches integer default 0,
  innings integer default 0,
  runs integer default 0,
  highest_score integer default 0,
  hundreds integer default 0,
  fifties integer default 0,
  strike_rate numeric(6,2) default 0,
  average numeric(6,2) default 0,
  created_at timestamptz default now()
);

create table if not exists player_records (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  title text,
  value text,
  description text,
  created_at timestamptz default now()
);

create table if not exists player_graph_points (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  format text,
  label text,
  value numeric(8,2) default 0,
  created_at timestamptz default now()
);

create index if not exists idx_player_career_player on player_career_stats(player_id);
create index if not exists idx_player_records_player on player_records(player_id);
create index if not exists idx_player_graph_player on player_graph_points(player_id);
