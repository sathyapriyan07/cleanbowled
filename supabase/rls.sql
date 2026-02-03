-- RLS policies for public read + admin write
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

alter table players enable row level security;
alter table teams enable row level security;
alter table team_squads enable row level security;
alter table team_records enable row level security;
alter table team_trophies enable row level security;
alter table team_venue_performance enable row level security;
alter table rankings enable row level security;
alter table records enable row level security;
alter table venue_records enable row level security;
alter table player_comparisons enable row level security;
alter table venues enable row level security;
alter table venue_images enable row level security;
alter table series enable row level security;
alter table series_teams enable row level security;
alter table series_points enable row level security;
alter table series_squads enable row level security;
alter table series_stats_leaders enable row level security;
alter table matches enable row level security;
alter table match_batting enable row level security;
alter table match_bowling enable row level security;
alter table match_playing_xi enable row level security;
alter table match_partnerships enable row level security;
alter table match_fall_of_wickets enable row level security;
alter table match_summary enable row level security;
alter table match_head_to_head enable row level security;
alter table player_match_stats enable row level security;
alter table player_career_stats enable row level security;
alter table player_records enable row level security;
alter table player_graph_points enable row level security;
alter table news enable row level security;

create policy "Public read players" on players for select using (true);
create policy "Public read teams" on teams for select using (true);
create policy "Public read team_squads" on team_squads for select using (true);
create policy "Public read team_records" on team_records for select using (true);
create policy "Public read team_trophies" on team_trophies for select using (true);
create policy "Public read team_venue_performance" on team_venue_performance for select using (true);
create policy "Public read rankings" on rankings for select using (true);
create policy "Public read records" on records for select using (true);
create policy "Public read venue_records" on venue_records for select using (true);
create policy "Public read player_comparisons" on player_comparisons for select using (true);
create policy "Public read venues" on venues for select using (true);
create policy "Public read venue_images" on venue_images for select using (true);
create policy "Public read series" on series for select using (true);
create policy "Public read series_teams" on series_teams for select using (true);
create policy "Public read series_points" on series_points for select using (true);
create policy "Public read series_squads" on series_squads for select using (true);
create policy "Public read series_stats_leaders" on series_stats_leaders for select using (true);
create policy "Public read matches" on matches for select using (true);
create policy "Public read match_batting" on match_batting for select using (true);
create policy "Public read match_bowling" on match_bowling for select using (true);
create policy "Public read match_playing_xi" on match_playing_xi for select using (true);
create policy "Public read match_partnerships" on match_partnerships for select using (true);
create policy "Public read match_fall_of_wickets" on match_fall_of_wickets for select using (true);
create policy "Public read match_summary" on match_summary for select using (true);
create policy "Public read match_head_to_head" on match_head_to_head for select using (true);
create policy "Public read player_match_stats" on player_match_stats for select using (true);
create policy "Public read player_career_stats" on player_career_stats for select using (true);
create policy "Public read player_records" on player_records for select using (true);
create policy "Public read player_graph_points" on player_graph_points for select using (true);
create policy "Public read news" on news for select using (true);

create policy "Admin write players" on players
  for all using (is_admin()) with check (is_admin());
create policy "Admin write teams" on teams
  for all using (is_admin()) with check (is_admin());
create policy "Admin write team_squads" on team_squads
  for all using (is_admin()) with check (is_admin());
create policy "Admin write team_records" on team_records
  for all using (is_admin()) with check (is_admin());
create policy "Admin write team_trophies" on team_trophies
  for all using (is_admin()) with check (is_admin());
create policy "Admin write team_venue_performance" on team_venue_performance
  for all using (is_admin()) with check (is_admin());
create policy "Admin write rankings" on rankings
  for all using (is_admin()) with check (is_admin());
create policy "Admin write records" on records
  for all using (is_admin()) with check (is_admin());
create policy "Admin write venue_records" on venue_records
  for all using (is_admin()) with check (is_admin());
create policy "Admin write player_comparisons" on player_comparisons
  for all using (is_admin()) with check (is_admin());
create policy "Admin write venues" on venues
  for all using (is_admin()) with check (is_admin());
create policy "Admin write venue_images" on venue_images
  for all using (is_admin()) with check (is_admin());
create policy "Admin write series" on series
  for all using (is_admin()) with check (is_admin());
create policy "Admin write series_teams" on series_teams
  for all using (is_admin()) with check (is_admin());
create policy "Admin write series_points" on series_points
  for all using (is_admin()) with check (is_admin());
create policy "Admin write series_squads" on series_squads
  for all using (is_admin()) with check (is_admin());
create policy "Admin write series_stats_leaders" on series_stats_leaders
  for all using (is_admin()) with check (is_admin());
create policy "Admin write matches" on matches
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_batting" on match_batting
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_bowling" on match_bowling
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_playing_xi" on match_playing_xi
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_partnerships" on match_partnerships
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_fall_of_wickets" on match_fall_of_wickets
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_summary" on match_summary
  for all using (is_admin()) with check (is_admin());
create policy "Admin write match_head_to_head" on match_head_to_head
  for all using (is_admin()) with check (is_admin());
create policy "Admin write player_match_stats" on player_match_stats
  for all using (is_admin()) with check (is_admin());
create policy "Admin write player_career_stats" on player_career_stats
  for all using (is_admin()) with check (is_admin());
create policy "Admin write player_records" on player_records
  for all using (is_admin()) with check (is_admin());
create policy "Admin write player_graph_points" on player_graph_points
  for all using (is_admin()) with check (is_admin());
create policy "Admin write news" on news
  for all using (is_admin()) with check (is_admin());
