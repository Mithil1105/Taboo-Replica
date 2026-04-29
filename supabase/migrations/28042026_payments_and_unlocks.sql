-- Payments and deck unlocks
-- Tables for Razorpay-backed deck purchases and per-user deck access.
-- Writes happen only from Edge Functions using the service role; users read their own rows.

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deck_id text not null,
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  razorpay_signature text,
  amount integer not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_user_idx
  on public.payment_orders (user_id, created_at desc);

create table if not exists public.deck_unlocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  deck_id text not null,
  order_id uuid references public.payment_orders(id) on delete set null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, deck_id)
);

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_on_payment_orders on public.payment_orders;
create trigger set_updated_at_on_payment_orders
  before update on public.payment_orders
  for each row execute function public.tg_set_updated_at();

alter table public.payment_orders enable row level security;
alter table public.deck_unlocks enable row level security;

-- Read-own policies for authenticated users.
drop policy if exists "payment_orders_select_own" on public.payment_orders;
create policy "payment_orders_select_own"
  on public.payment_orders
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "deck_unlocks_select_own" on public.deck_unlocks;
create policy "deck_unlocks_select_own"
  on public.deck_unlocks
  for select
  to authenticated
  using (auth.uid() = user_id);

-- No insert/update/delete policies for anon/authenticated:
-- writes are exclusively performed via Edge Functions using the service_role
-- key (which bypasses RLS).

grant select on public.payment_orders to authenticated;
grant select on public.deck_unlocks to authenticated;
