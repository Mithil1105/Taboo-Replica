-- Set initial super admin in database (no env fallback).
-- Safe to run multiple times.

insert into public.app_user_roles (user_id, role)
select id, 'super_admin'
from auth.users
where lower(email) = 'mithil20056mistry@gmail.com'
on conflict (user_id) do update
set role = excluded.role,
    updated_at = now();
