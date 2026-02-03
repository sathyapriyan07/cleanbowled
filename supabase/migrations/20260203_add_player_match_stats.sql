-- Add per-player match stats for player profile Match tab
create table if not exists player_match_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  match_id uuid references matches(id) on delete cascade,
  runs integer default 0,
  balls integer default 0,
  fours integer default 0,
  sixes integer default 0,
  strike_rate numeric(6,2) default 0,
  average numeric(6,2) default 0,
  innings integer default 1,
  not_outs integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_player_stats_player on player_match_stats(player_id);
create index if not exists idx_player_stats_match on player_match_stats(match_id);
