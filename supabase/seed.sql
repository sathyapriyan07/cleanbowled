-- Seed data for local/dev previews
insert into teams (name, logo)
values
  ('India', null),
  ('Australia', null)
on conflict do nothing;

insert into players (name, country, role, batting_style, bowling_style, bio)
values
  ('Arjun Mehta', 'India', 'Top-order Batter', 'Right-hand', 'Off spin', 'Aggressive opener known for powerplay dominance.'),
  ('Liam Carter', 'Australia', 'Fast Bowler', 'Right-hand', 'Right-arm fast', 'Right-arm quick with heavy swing under lights.')
on conflict do nothing;

insert into series (name, location, start_date, end_date)
values
  ('Oceanic Trophy 2026', 'Sydney · Perth', '2026-01-10', '2026-02-20')
on conflict do nothing;

insert into matches (series_id, team1_id, team2_id, score1, score2, overs1, overs2, result, venue, date, status)
select
  s.id,
  t1.id,
  t2.id,
  '178/6',
  '171/9',
  '20.0',
  '20.0',
  'India won by 7 runs',
  'Harbor Oval',
  '2026-02-01',
  'Completed'
from series s
join teams t1 on t1.name = 'India'
join teams t2 on t2.name = 'Australia'
where s.name = 'Oceanic Trophy 2026'
limit 1;
