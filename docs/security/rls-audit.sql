-- READ-ONLY database permission check (security review, follow-up 1).
-- Paste into Supabase -> SQL Editor and click Run. Changes nothing.
-- Each result has a "check" column saying what it shows; anything under "PROBLEM" needs a look.
-- Easiest: send the whole output to whoever maintains the site.

-- 1. Tables the website's public API can reach WITHOUT row-level security (anyone with the
--    public key could read/write every row, subject only to grants).
select 'PROBLEM: table without RLS' as check, c.relname as name, null::text as detail
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity

union all
-- 2. Every RLS policy on public tables and storage (who can do what).
select 'policy', tablename || ' / ' || policyname,
       'roles=' || array_to_string(roles, ',') || ' cmd=' || cmd ||
       ' using=' || coalesce(qual, '-') || ' check=' || coalesce(with_check, '-')
from pg_policies where schemaname in ('public', 'storage')

union all
-- 3. Policies that let signed-OUT visitors (anon / public) write anything.
select 'PROBLEM: anonymous write policy', tablename || ' / ' || policyname, cmd
from pg_policies
where schemaname in ('public', 'storage')
  and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  and (roles && array['anon', 'public']::name[])

union all
-- 4. Functions that run with the owner's rights (SECURITY DEFINER) and are callable via the API.
select 'review: security definer function', p.proname, pg_get_function_identity_arguments(p.oid)
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef

union all
-- 5. Views in public (views ignore the caller's RLS unless created with security_invoker).
select 'review: view', c.relname,
       case when coalesce(array_to_string(c.reloptions, ','), '') like '%security_invoker=true%'
            then 'security_invoker' else 'PROBLEM: runs with owner rights' end
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'v'

union all
-- 6. Storage buckets and whether files are publicly readable by URL.
select 'bucket', id, case when public then 'public read' else 'private' end
from storage.buckets

order by 1, 2;
