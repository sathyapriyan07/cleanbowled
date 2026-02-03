-- Series/Tournament module enhancements
alter table if exists series
  add column if not exists season text,
  add column if not exists is_archived boolean default false;

create table if not exists series_teams (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists series_points (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  played integer default 0,
  won integer default 0,
  lost integer default 0,
  tied integer default 0,
  no_result integer default 0,
  points integer default 0,
  net_run_rate numeric(6,2) default 0,
  created_at timestamptz default now()
);

create table if not exists series_squads (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  role text,
  created_at timestamptz default now()
);

create table if not exists series_stats_leaders (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete cascade,
  stat_type text,
  player_name text,
  team_name text,
  value numeric(8,2) default 0,
  created_at timestamptz default now()
);

create index if not exists idx_series_teams_series on series_teams(series_id);
create index if not exists idx_series_points_series on series_points(series_id);
create index if not exists idx_series_squads_series on series_squads(series_id);
create index if not exists idx_series_stats_series on series_stats_leaders(series_id);
