-- SQL migration to create the bookmarks table expected by the app
create extension if not exists pgcrypto;

create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  title text,
  url text,
  notes text,
  tags text[],
  favorite boolean default false,
  created_at timestamptz default now()
);
