-- Core schema for Cricket Stats CMS
create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dob date,
  country text,
  role text,
  batting_style text,
  bowling_style text,
  height text,
  bio text,
  profile_image text,
  banner text,
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  banner text,
  captain text,
  coach text,
  created_at timestamptz default now()
);

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  banner text,
  location text,
  start_date date,
  end_date date,
  season text,
  format text,
  is_archived boolean default false,
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series(id) on delete set null,
  team1_id uuid references teams(id) on delete set null,
  team2_id uuid references teams(id) on delete set null,
  format text,
  score1 text,
  score2 text,
  overs1 text,
  overs2 text,
  result text,
  venue text,
  date date,
  thumbnail text,
  status text,
  toss_winner_id uuid references teams(id) on delete set null,
  toss_decision text,
  umpires text,
  referee text,
  player_of_match_id uuid references players(id) on delete set null,
  created_at timestamptz default now()
);

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

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text,
  city text,
  country text,
  capacity integer default 0,
  pitch_type text,
  average_score text,
  image text,
  created_at timestamptz default now()
);

create table if not exists venue_images (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references venues(id) on delete cascade,
  image_url text,
  caption text,
  created_at timestamptz default now()
);

create table if not exists match_batting (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete set null,
  runs integer default 0,
  balls integer default 0,
  fours integer default 0,
  sixes integer default 0,
  strike_rate numeric(5,2) default 0,
  created_at timestamptz default now()
);

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

create table if not exists match_playing_xi (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete set null,
  team_id uuid references teams(id) on delete set null,
  status text default 'IN',
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

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text,
  content text,
  player_id uuid references players(id) on delete set null,
  match_id uuid references matches(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_matches_series on matches(series_id);
create index if not exists idx_matches_team1 on matches(team1_id);
create index if not exists idx_matches_team2 on matches(team2_id);
create index if not exists idx_series_teams_series on series_teams(series_id);
create index if not exists idx_series_points_series on series_points(series_id);
create index if not exists idx_series_squads_series on series_squads(series_id);
create index if not exists idx_series_stats_series on series_stats_leaders(series_id);
create index if not exists idx_team_squads_team on team_squads(team_id);
create index if not exists idx_team_records_team on team_records(team_id);
create index if not exists idx_team_trophies_team on team_trophies(team_id);
create index if not exists idx_team_venue_team on team_venue_performance(team_id);
create index if not exists idx_rankings_category on rankings(category);
create index if not exists idx_rankings_format on rankings(format);
create index if not exists idx_records_category on records(category);
create index if not exists idx_records_format on records(format);
create index if not exists idx_venue_records_venue on venue_records(venue);
create index if not exists idx_player_comparisons_format on player_comparisons(format);
create index if not exists idx_venues_city on venues(city);
create index if not exists idx_venue_images_venue on venue_images(venue_id);
create index if not exists idx_match_batting_match on match_batting(match_id);
create index if not exists idx_match_bowling_match on match_bowling(match_id);
create index if not exists idx_match_xi_match on match_playing_xi(match_id);
create index if not exists idx_match_partnerships_match on match_partnerships(match_id);
create index if not exists idx_match_fow_match on match_fall_of_wickets(match_id);
create index if not exists idx_match_summary_match on match_summary(match_id);
create index if not exists idx_match_h2h_match on match_head_to_head(match_id);
create index if not exists idx_player_stats_player on player_match_stats(player_id);
create index if not exists idx_player_stats_match on player_match_stats(match_id);
create index if not exists idx_player_career_player on player_career_stats(player_id);
create index if not exists idx_player_records_player on player_records(player_id);
create index if not exists idx_player_graph_player on player_graph_points(player_id);
create index if not exists idx_news_player on news(player_id);
create index if not exists idx_news_match on news(match_id);
