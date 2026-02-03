-- Matches enhancements: officials, toss, summaries, partnerships, bowling, fall of wickets, head-to-head
alter table if exists matches
  add column if not exists toss_winner_id uuid references teams(id) on delete set null,
  add column if not exists toss_decision text,
  add column if not exists umpires text,
  add column if not exists referee text,
  add column if not exists player_of_match_id uuid references players(id) on delete set null;

create table if not exists match_bowling (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete set null,
  overs numeric(4,1) default 0,
  maidens integer default 0,
  runs_conceded integer default 0,
  wickets integer default 0,
  economy numeric(5,2) default 0,
  created_at timestamptz default now()
);

create table if not exists match_partnerships (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id) on delete set null,
  players text,
  runs integer default 0,
  balls integer default 0,
  wicket_number integer default 0,
  created_at timestamptz default now()
);

create table if not exists match_fall_of_wickets (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id) on delete set null,
  wicket_number integer default 0,
  score text,
  over text,
  player_out text,
  created_at timestamptz default now()
);

create table if not exists match_summary (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  key_moments text,
  highlights text,
  created_at timestamptz default now()
);

create table if not exists match_head_to_head (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  team1_id uuid references teams(id) on delete set null,
  team2_id uuid references teams(id) on delete set null,
  team1_wins integer default 0,
  team2_wins integer default 0,
  no_result integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_match_bowling_match on match_bowling(match_id);
create index if not exists idx_match_partnerships_match on match_partnerships(match_id);
create index if not exists idx_match_fow_match on match_fall_of_wickets(match_id);
create index if not exists idx_match_summary_match on match_summary(match_id);
create index if not exists idx_match_h2h_match on match_head_to_head(match_id);
