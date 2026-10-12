-- Joy review comments: run once in Supabase → SQL Editor.
create table if not exists public.review_comments (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.review_comments enable row level security;

-- Guests (anon key) may read / add / edit / delete comments. No accounts needed.
create policy "guest read"   on public.review_comments for select to anon using (true);
create policy "guest insert" on public.review_comments for insert to anon with check (true);
create policy "guest update" on public.review_comments for update to anon using (true) with check (true);
create policy "guest delete" on public.review_comments for delete to anon using (true);
