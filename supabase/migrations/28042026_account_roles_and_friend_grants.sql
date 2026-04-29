-- Account roles + friend timeline grants
-- Roles:
--   regular     -> paying customer (lifetime via deck_unlocks)
--   friend      -> access granted by super admin (timeline-based)
--   super_admin -> full control

create table if not exists public.app_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'regular' check (role in ('regular', 'friend', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.friend_deck_grants (
  id uuid primary key default gen_random_uuid(),
  grantee_user_id uuid not null references auth.users(id) on delete cascade,
  deck_id text not null,
  granted_by_user_id uuid not null references auth.users(id) on delete cascade,
  note text,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revoked_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists friend_deck_grants_grantee_idx
  on public.friend_deck_grants (grantee_user_id, deck_id, expires_at, revoked_at);

create or replace function public.tg_set_updated_at_generic()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_on_app_user_roles on public.app_user_roles;
create trigger set_updated_at_on_app_user_roles
  before update on public.app_user_roles
  for each row execute function public.tg_set_updated_at_generic();

alter table public.app_user_roles enable row level security;
alter table public.friend_deck_grants enable row level security;

drop policy if exists "app_user_roles_select_own" on public.app_user_roles;
create policy "app_user_roles_select_own"
  on public.app_user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "friend_deck_grants_select_own" on public.friend_deck_grants;
create policy "friend_deck_grants_select_own"
  on public.friend_deck_grants
  for select
  to authenticated
  using (auth.uid() = grantee_user_id);

drop policy if exists "app_user_roles_super_admin_manage" on public.app_user_roles;
create policy "app_user_roles_super_admin_manage"
  on public.app_user_roles
  for all
  to authenticated
  using (
    exists (
      select 1 from public.app_user_roles r
      where r.user_id = auth.uid() and r.role = 'super_admin'
    )
  )
  with check (
    exists (
      select 1 from public.app_user_roles r
      where r.user_id = auth.uid() and r.role = 'super_admin'
    )
  );

drop policy if exists "friend_deck_grants_super_admin_manage" on public.friend_deck_grants;
create policy "friend_deck_grants_super_admin_manage"
  on public.friend_deck_grants
  for all
  to authenticated
  using (
    exists (
      select 1 from public.app_user_roles r
      where r.user_id = auth.uid() and r.role = 'super_admin'
    )
  )
  with check (
    exists (
      select 1 from public.app_user_roles r
      where r.user_id = auth.uid() and r.role = 'super_admin'
    )
  );
