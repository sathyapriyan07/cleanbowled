-- Team module: squad, records, trophies, venue performance, banner/captain/coach
alter table if exists teams
  add column if not exists banner text,
  add column if not exists captain text,
  add column if not exists coach text;

create table if not exists team_squads (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  role text,
  created_at timestamptz default now()
);

create table if not exists team_records (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  title text,
  value text,
  description text,
  created_at timestamptz default now()
);

create table if not exists team_trophies (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  title text,
  year text,
  description text,
  created_at timestamptz default now()
);

create table if not exists team_venue_performance (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  venue text,
  matches integer default 0,
  wins integer default 0,
  losses integer default 0,
  no_result integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_team_squads_team on team_squads(team_id);
create index if not exists idx_team_records_team on team_records(team_id);
create index if not exists idx_team_trophies_team on team_trophies(team_id);
create index if not exists idx_team_venue_team on team_venue_performance(team_id);
