-- Venues/Stadiums module
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

create index if not exists idx_venues_city on venues(city);
create index if not exists idx_venue_images_venue on venue_images(venue_id);
