-- Link news to matches for related news sections
alter table if exists news
  add column if not exists match_id uuid references matches(id) on delete set null;

create index if not exists idx_news_match on news(match_id);
