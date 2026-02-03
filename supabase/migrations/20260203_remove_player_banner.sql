-- Remove deprecated player banner column
alter table if exists players
  drop column if exists banner;
