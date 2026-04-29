-- Robust self-role resolver for the frontend.
-- This avoids client-side silent fallbacks caused by RLS/policy mismatches.

create or replace function public.get_my_account_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select role
  into v_role
  from public.app_user_roles
  where user_id = auth.uid();

  if v_role is null then
    return 'regular';
  end if;

  return v_role;
end;
$$;

revoke all on function public.get_my_account_role() from public;
grant execute on function public.get_my_account_role() to authenticated;
