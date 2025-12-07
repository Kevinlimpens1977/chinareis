-- Migration for China Tetris Tables
-- Run this in Supabase SQL Editor

-- 1. Create china_players table (Leaderboard)
create table if not exists china_players (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text not null,
  city text,
  highscore int default 0,
  lottery_tickets int default 0,
  last_played timestamptz default now(),
  is_verified boolean default false
);

-- Enable RLS
alter table china_players enable row level security;

-- Policies for china_players
create policy "Allow public read on china_players"
  on china_players for select
  using (true);

create policy "Allow authenticated update on china_players"
  on china_players for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on china_players"
  on china_players for insert
  with check (auth.role() = 'authenticated');


-- 2. Create china_game_plays table (Game History)
create table if not exists china_game_plays (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  email text,
  score int,
  tickets_earned int,
  played_at timestamptz default now()
);

-- Enable RLS
alter table china_game_plays enable row level security;

-- Policies for china_game_plays
create policy "Allow authenticated insert on china_game_plays"
  on china_game_plays for insert
  with check (auth.role() = 'authenticated');

create policy "Allow public read on china_game_plays"
  on china_game_plays for select
  using (true);


-- 3. RPC Function to atomic update highscore and accumulate tickets
create or replace function update_china_highscore(
  p_email text,
  p_name text,
  p_city text,
  p_score int,
  p_tickets int
)
returns void
language plpgsql
security definer
as $$
begin
  -- Insert or Update player
  insert into china_players (email, name, city, highscore, lottery_tickets, last_played)
  values (p_email, p_name, p_city, p_score, p_tickets, now())
  on conflict (email)
  do update set
    -- Only update highscore if new score is higher
    highscore = greatest(china_players.highscore, excluded.highscore),
    -- Accumulate tickets (add new tickets to existing total)
    lottery_tickets = china_players.lottery_tickets + excluded.lottery_tickets,
    -- Always update last_played and details to latest
    name = excluded.name,
    city = excluded.city,
    last_played = now();
end;
$$;
