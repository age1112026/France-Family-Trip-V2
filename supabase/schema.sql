create extension if not exists "pgcrypto";

create table if not exists public.pois (
  id text primary key,
  slug text not null unique,
  name text not null,
  name_local text,
  city_region text not null check (city_region in ('Paris', 'Mont-Saint-Michel', 'Nice', 'French Riviera East', 'French Riviera West')),
  categories text[] not null default '{}',
  audience_tags text[] not null default '{}',
  classic_level text not null check (classic_level in ('大众经典', '高价值经典', '小众宝藏', '可选补充')),
  short_intro text not null,
  editor_reason text not null,
  caution_reason text not null,
  suggested_duration text not null,
  transport_difficulty text not null check (transport_difficulty in ('低', '中', '高')),
  physical_intensity text not null check (physical_intensity in ('低', '中', '高')),
  language_barrier text not null check (language_barrier in ('低', '中', '高')),
  reservation_required boolean not null default false,
  latest_reservation_advice text not null,
  price_level text not null,
  official_url text not null,
  map_url text not null,
  source_urls text[] not null default '{}',
  review_summary text not null,
  editor_note text not null,
  family_fit_score int,
  fit_reason text,
  possible_mismatch text,
  best_use text,
  use_cases text[] not null default '{}',
  transport_note text,
  verify_before text,
  content_status text not null default 'base',
  rainy_day_suitable boolean not null default false,
  night_suitable boolean not null default false,
  easy_day_suitable boolean not null default false,
  verification_status text not null check (verification_status in ('已核实', '待核实', '可能变化')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poi_images (
  id uuid primary key default gen_random_uuid(),
  poi_id text not null references public.pois(id) on delete cascade,
  image_url text not null,
  alt text not null,
  caption text not null,
  source_url text not null,
  sort_order int not null default 1
);

create table if not exists public.poi_links (
  id uuid primary key default gen_random_uuid(),
  poi_id text not null references public.pois(id) on delete cascade,
  label text not null,
  url text not null,
  link_type text not null check (link_type in ('official', 'map', 'reviews', 'tourism', 'michelin', 'reference')),
  source_note text
);

create table if not exists public.family_members (
  id text primary key,
  display_name text not null,
  sort_order int not null
);

insert into public.family_members (id, display_name, sort_order)
values
  ('me', '我', 1),
  ('dad', '爸爸', 2),
  ('mom', '妈妈', 3)
on conflict (id) do update
set display_name = excluded.display_name,
    sort_order = excluded.sort_order;

create table if not exists public.poi_interest_votes (
  id uuid primary key default gen_random_uuid(),
  poi_id text not null references public.pois(id) on delete cascade,
  member_id text not null references public.family_members(id) on delete cascade,
  interest_level text not null check (interest_level in ('must_go', 'okay', 'neutral', 'not_interested', 'revisit')),
  note text not null default '',
  updated_at timestamptz not null default now(),
  unique (poi_id, member_id)
);

create index if not exists idx_pois_city_region on public.pois(city_region);
create index if not exists idx_poi_votes_poi on public.poi_interest_votes(poi_id);

alter table public.pois add column if not exists family_fit_score int;
alter table public.pois add column if not exists fit_reason text;
alter table public.pois add column if not exists possible_mismatch text;
alter table public.pois add column if not exists best_use text;
alter table public.pois add column if not exists use_cases text[] not null default '{}';
alter table public.pois add column if not exists transport_note text;
alter table public.pois add column if not exists verify_before text;
alter table public.pois add column if not exists content_status text not null default 'base';

alter table public.pois enable row level security;
alter table public.poi_images enable row level security;
alter table public.poi_links enable row level security;
alter table public.family_members enable row level security;
alter table public.poi_interest_votes enable row level security;

drop policy if exists "Public read pois" on public.pois;
create policy "Public read pois" on public.pois for select using (true);

drop policy if exists "Public read poi images" on public.poi_images;
create policy "Public read poi images" on public.poi_images for select using (true);

drop policy if exists "Public read poi links" on public.poi_links;
create policy "Public read poi links" on public.poi_links for select using (true);

drop policy if exists "Public read family members" on public.family_members;
create policy "Public read family members" on public.family_members for select using (true);

-- Votes are read and written through Next.js API routes using the service role key.
-- No public write policy is added here.
drop policy if exists "No direct public vote writes" on public.poi_interest_votes;
create policy "No direct public vote writes" on public.poi_interest_votes for select using (false);
