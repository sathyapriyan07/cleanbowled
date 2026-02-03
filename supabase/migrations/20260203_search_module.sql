-- Search filters support: add format to series/matches
alter table if exists series
  add column if not exists format text;

alter table if exists matches
  add column if not exists format text;
