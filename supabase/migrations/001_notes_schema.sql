-- ============================================================
-- aiGTD Second Brain Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable pgvector extension
create extension if not exists vector;

-- ============================================================
-- NOTES TABLE
-- Core knowledge base - markdown notes with wikilinks
-- ============================================================
create table notes (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,          -- device fingerprint or apple user id
  title        text not null,
  body         text not null default '',
  tags         text[] default '{}',
  linked_tasks text[] default '{}',    -- task ids this note references
  linked_notes uuid[] default '{}',    -- other note ids (wikilinks)
  embedding    vector(1024),           -- voyage-3-lite produces 1024 dims
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ============================================================
-- FULL TEXT SEARCH
-- Fast keyword search index on title + body
-- ============================================================
alter table notes
  add column fts tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
  ) stored;

create index notes_fts_idx on notes using gin(fts);

-- ============================================================
-- VECTOR INDEX
-- HNSW is recommended for < 1M rows - faster queries
-- ============================================================
create index notes_embedding_idx on notes
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- ============================================================
-- SEMANTIC SEARCH FUNCTION
-- Called from the app via supabase.rpc()
-- Returns notes ordered by cosine similarity
-- ============================================================
create or replace function search_notes (
  query_embedding  vector(1024),
  match_threshold  float     default 0.5,
  match_count      int       default 5,
  p_user_id        text      default null
)
returns table (
  id          uuid,
  title       text,
  body        text,
  tags        text[],
  similarity  float,
  created_at  timestamptz
)
language sql stable
as $$
  select
    n.id,
    n.title,
    n.body,
    n.tags,
    1 - (n.embedding <=> query_embedding) as similarity,
    n.created_at
  from notes n
  where
    (p_user_id is null or n.user_id = p_user_id)
    and n.embedding is not null
    and 1 - (n.embedding <=> query_embedding) > match_threshold
  order by n.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- HYBRID SEARCH FUNCTION
-- Combines semantic (vector) + keyword (FTS) search
-- Best of both worlds: meaning AND exact terms
-- ============================================================
create or replace function hybrid_search_notes (
  query_text       text,
  query_embedding  vector(1024),
  match_count      int   default 5,
  p_user_id        text  default null,
  semantic_weight  float default 0.7,
  keyword_weight   float default 0.3
)
returns table (
  id         uuid,
  title      text,
  body       text,
  tags       text[],
  score      float,
  created_at timestamptz
)
language sql stable
as $$
  with semantic as (
    select
      n.id,
      1 - (n.embedding <=> query_embedding) as sem_score
    from notes n
    where
      (p_user_id is null or n.user_id = p_user_id)
      and n.embedding is not null
    order by n.embedding <=> query_embedding
    limit 20
  ),
  keyword as (
    select
      n.id,
      ts_rank(n.fts, plainto_tsquery('english', query_text)) as kw_score
    from notes n
    where
      (p_user_id is null or n.user_id = p_user_id)
      and n.fts @@ plainto_tsquery('english', query_text)
    limit 20
  ),
  combined as (
    select
      coalesce(s.id, k.id) as id,
      coalesce(s.sem_score, 0) * semantic_weight +
      coalesce(k.kw_score, 0) * keyword_weight    as score
    from semantic s
    full outer join keyword k on s.id = k.id
  )
  select
    n.id, n.title, n.body, n.tags, c.score, n.created_at
  from combined c
  join notes n on n.id = c.id
  order by c.score desc
  limit match_count;
$$;

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_updated_at
  before update on notes
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Each device/user only sees their own notes
-- ============================================================
alter table notes enable row level security;

-- Policy: user can only access their own notes
-- user_id is set from the app (device ID or authenticated user)
create policy "users_own_notes" on notes
  for all
  using (user_id = current_setting('app.user_id', true));

-- If you want to disable RLS for testing, run:
-- alter table notes disable row level security;
