-- Green Path : comptes « pseudo seul » (sans e-mail), sauvegarde et classement. Voir supabase/README.md.
-- Aucune table n'est lisible ni modifiable directement par l'API publique (RLS activée, aucune politique) :
-- tout passe par cinq fonctions (RPC) qui vérifient un code secret ; seul le haché du code est stocké.

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  pseudo text not null,
  code_hash text not null,
  avatar jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_pseudo_format check (pseudo ~ '^[A-Za-z0-9_-]{3,16}$')
);
create unique index profiles_pseudo_lower_key on public.profiles (lower(pseudo));
create unique index profiles_code_hash_key on public.profiles (code_hash);

create table public.progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  level text not null check (char_length(level) between 1 and 40),
  stars smallint not null check (stars between 0 and 3),
  pixels integer not null check (pixels between 0 and 1000),
  best_time_ms integer check (best_time_ms is null or (best_time_ms > 0 and best_time_ms < 36000000)),
  deaths integer check (deaths is null or deaths between 0 and 100000),
  updated_at timestamptz not null default now(),
  primary key (profile_id, level)
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
revoke all on public.profiles, public.progress from anon, authenticated;

create function public.gp_hash(p_code text) returns text
language sql immutable set search_path = ''
as $$ select encode(extensions.digest(convert_to(p_code, 'utf8'), 'sha256'), 'hex') $$;
revoke all on function public.gp_hash(text) from public, anon, authenticated;

create function public.gp_register(p_pseudo text, p_code text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
begin
  if p_pseudo is null or p_pseudo !~ '^[A-Za-z0-9_-]{3,16}$' then
    return jsonb_build_object('ok', false, 'error', 'pseudo_invalid');
  end if;
  if p_code is null or char_length(p_code) < 20 or char_length(p_code) > 64 then
    return jsonb_build_object('ok', false, 'error', 'code_invalid');
  end if;
  begin
    insert into public.profiles (pseudo, code_hash) values (p_pseudo, public.gp_hash(p_code));
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'pseudo_taken');
  end;
  return jsonb_build_object('ok', true, 'pseudo', p_pseudo);
end $$;

create function public.gp_login(p_pseudo text, p_code text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare p public.profiles;
begin
  select * into p from public.profiles
   where lower(pseudo) = lower(coalesce(p_pseudo, '')) and code_hash = public.gp_hash(coalesce(p_code, ''));
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  return jsonb_build_object(
    'ok', true, 'pseudo', p.pseudo, 'avatar', p.avatar,
    'progress', coalesce((select jsonb_agg(jsonb_build_object(
        'level', g.level, 'stars', g.stars, 'pixels', g.pixels, 'best_time_ms', g.best_time_ms, 'deaths', g.deaths))
      from public.progress g where g.profile_id = p.id), '[]'::jsonb));
end $$;

create function public.gp_save(p_code text, p_avatar jsonb, p_progress jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare pid uuid; e jsonb;
begin
  select id into pid from public.profiles where code_hash = public.gp_hash(coalesce(p_code, ''));
  if pid is null then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if p_avatar is not null and (jsonb_typeof(p_avatar) <> 'object' or octet_length(p_avatar::text) > 2000) then
    return jsonb_build_object('ok', false, 'error', 'avatar_invalid');
  end if;
  if p_progress is not null and (jsonb_typeof(p_progress) <> 'array' or jsonb_array_length(p_progress) > 64) then
    return jsonb_build_object('ok', false, 'error', 'progress_invalid');
  end if;
  update public.profiles set avatar = coalesce(p_avatar, avatar), updated_at = now() where id = pid;
  for e in select * from jsonb_array_elements(coalesce(p_progress, '[]'::jsonb)) loop
    insert into public.progress as g (profile_id, level, stars, pixels, best_time_ms, deaths)
    values (pid, left(e->>'level', 40), least(greatest(coalesce((e->>'stars')::int, 0), 0), 3),
            least(greatest(coalesce((e->>'pixels')::int, 0), 0), 1000),
            nullif((e->>'best_time_ms')::int, 0), nullif((e->>'deaths')::int, -1))
    on conflict (profile_id, level) do update set
      stars = greatest(g.stars, excluded.stars),
      pixels = greatest(g.pixels, excluded.pixels),
      best_time_ms = case when g.best_time_ms is null then excluded.best_time_ms
                          when excluded.best_time_ms is null then g.best_time_ms
                          else least(g.best_time_ms, excluded.best_time_ms) end,
      deaths = case when g.deaths is null then excluded.deaths
                    when excluded.deaths is null then g.deaths
                    else least(g.deaths, excluded.deaths) end,
      updated_at = now();
  end loop;
  return jsonb_build_object('ok', true);
end $$;

create function public.gp_scoreboard(p_limit integer default 20)
returns table (rank bigint, pseudo text, total_stars integer, levels integer, total_time_ms bigint)
language sql security definer set search_path = ''
as $$
  select row_number() over (order by sum(g.stars) desc, coalesce(sum(g.best_time_ms), 0) asc, p.pseudo asc) as rank,
         p.pseudo, sum(g.stars)::int, count(*)::int, coalesce(sum(g.best_time_ms), 0)::bigint
    from public.profiles p join public.progress g on g.profile_id = p.id
   group by p.id, p.pseudo
   order by 1
   limit least(greatest(coalesce(p_limit, 20), 1), 50)
$$;

create function public.gp_delete(p_code text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
begin
  delete from public.profiles where code_hash = public.gp_hash(coalesce(p_code, ''));
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.gp_register(text, text), public.gp_login(text, text),
  public.gp_save(text, jsonb, jsonb), public.gp_scoreboard(integer), public.gp_delete(text) from public, authenticated;
grant execute on function public.gp_register(text, text), public.gp_login(text, text),
  public.gp_save(text, jsonb, jsonb), public.gp_scoreboard(integer), public.gp_delete(text) to anon;
