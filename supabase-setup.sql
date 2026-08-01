-- 在 Supabase SQL Editor 執行一次即可
create table if not exists public.results (
  id bigint generated always as identity primary key,
  test_date date not null,
  listening_correct int not null,
  reading_correct int not null,
  est_listening int not null,
  est_reading int not null,
  est_total int not null,
  duration_sec int,
  created_at timestamptz default now()
);

alter table public.results enable row level security;

-- 個人練習用途：允許匿名讀寫（單一使用者專案）
create policy "anon insert" on public.results for insert to anon with check (true);
create policy "anon select" on public.results for select to anon using (true);
