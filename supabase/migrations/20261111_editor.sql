-- Éditeur de niveaux et de textures : rôle admin, niveaux modifiés, textures créées.
-- À appliquer UNE fois sur le projet green-path (après accord de l'équipe). Tout passe par des fonctions qui vérifient le code secret ;
-- les tables restent fermées (RLS sans politique). Voir supabase/README.md.
alter table public.profiles add column if not exists is_admin boolean not null default false;

create table public.gp_levels (
  level text primary key check (level in ('jardin-des-plantes','cathedrale','chateau','feydeau','graslin','machines','chantiers','buren','hangar','memorial','pommeraye','tour-lu')),
  doc jsonb not null check (jsonb_typeof(doc) = 'object' and octet_length(doc::text) <= 900000),
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);
create table public.gp_levels_history (
  id bigint generated always as identity primary key,
  level text not null,
  version integer not null,
  doc jsonb not null,
  saved_at timestamptz not null default now(),
  saved_by uuid references public.profiles(id) on delete set null
);
create index gp_levels_history_level_idx on public.gp_levels_history (level, id desc);
create table public.gp_textures (
  id text primary key check (id ~ '^[a-z0-9_]{3,60}$'),
  doc jsonb not null check (jsonb_typeof(doc) = 'object' and octet_length(doc::text) <= 60000),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);
alter table public.gp_levels enable row level security;
alter table public.gp_levels_history enable row level security;
alter table public.gp_textures enable row level security;
revoke all on public.gp_levels, public.gp_levels_history, public.gp_textures from anon, authenticated;

-- id du profil admin dont le code est donné, ou null (jamais exposée à l'API publique)
create function public.gp_admin_id(p_code text) returns uuid
language sql stable security definer set search_path = ''
as $$ select id from public.profiles where is_admin and code_hash = public.gp_hash(coalesce(p_code, '')) $$;
revoke all on function public.gp_admin_id(text) from public, anon, authenticated;

-- connexion : renvoie aussi le rôle (le serveur le revérifie à chaque écriture)
create or replace function public.gp_login(p_pseudo text, p_code text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare p public.profiles;
begin
  select * into p from public.profiles
   where lower(pseudo) = lower(coalesce(p_pseudo, '')) and code_hash = public.gp_hash(coalesce(p_code, ''));
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  return jsonb_build_object(
    'ok', true, 'pseudo', p.pseudo, 'avatar', p.avatar, 'admin', p.is_admin,
    'progress', coalesce((select jsonb_agg(jsonb_build_object(
        'level', g.level, 'stars', g.stars, 'pixels', g.pixels, 'best_time_ms', g.best_time_ms, 'deaths', g.deaths))
      from public.progress g where g.profile_id = p.id), '[]'::jsonb));
end $$;

-- contenu publié (public) : niveaux modifiés et textures créées
create function public.gp_content_get() returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'levels', coalesce((select jsonb_object_agg(level, jsonb_build_object('doc', doc, 'version', version)) from public.gp_levels), '{}'::jsonb),
    'textures', coalesce((select jsonb_object_agg(id, doc) from public.gp_textures), '{}'::jsonb))
$$;

-- l'admin vérifie son rôle (sans rien écrire)
create function public.gp_admin_check(p_code text) returns jsonb
language sql stable security definer set search_path = ''
as $$ select jsonb_build_object('ok', public.gp_admin_id(p_code) is not null) $$;

create function public.gp_level_save(p_code text, p_level text, p_doc jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare aid uuid; v integer;
begin
  aid := public.gp_admin_id(p_code);
  if aid is null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  if p_doc is null or jsonb_typeof(p_doc) <> 'object' or octet_length(p_doc::text) > 900000 then
    return jsonb_build_object('ok', false, 'error', 'doc_invalid');
  end if;
  insert into public.gp_levels as l (level, doc, version, updated_by) values (p_level, p_doc, 1, aid)
  on conflict (level) do update set doc = excluded.doc, version = l.version + 1, updated_at = now(), updated_by = aid
  returning version into v;
  insert into public.gp_levels_history (level, version, doc, saved_by) values (p_level, v, p_doc, aid);
  delete from public.gp_levels_history where level = p_level and id not in
    (select id from public.gp_levels_history where level = p_level order by id desc limit 30);
  return jsonb_build_object('ok', true, 'version', v);
exception when check_violation or not_null_violation then
  return jsonb_build_object('ok', false, 'error', 'doc_invalid');
end $$;

create function public.gp_level_reset(p_code text, p_level text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
begin
  if public.gp_admin_id(p_code) is null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  delete from public.gp_levels where level = p_level;
  return jsonb_build_object('ok', true);
end $$;

create function public.gp_level_history(p_code text, p_level text) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if public.gp_admin_id(p_code) is null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  return jsonb_build_object('ok', true, 'items', coalesce((select jsonb_agg(jsonb_build_object('id', h.id, 'version', h.version, 'saved_at', h.saved_at) order by h.id desc)
    from public.gp_levels_history h where h.level = p_level), '[]'::jsonb));
end $$;

create function public.gp_level_history_get(p_code text, p_id bigint) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare d jsonb;
begin
  if public.gp_admin_id(p_code) is null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  select doc into d from public.gp_levels_history where id = p_id;
  if d is null then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  return jsonb_build_object('ok', true, 'doc', d);
end $$;

create function public.gp_texture_save(p_code text, p_id text, p_doc jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare aid uuid;
begin
  aid := public.gp_admin_id(p_code);
  if aid is null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  if p_id is null or p_id !~ '^[a-z0-9_]{3,60}$' or p_doc is null or jsonb_typeof(p_doc) <> 'object' or octet_length(p_doc::text) > 60000 then
    return jsonb_build_object('ok', false, 'error', 'doc_invalid');
  end if;
  insert into public.gp_textures as t (id, doc, updated_by) values (p_id, p_doc, aid)
  on conflict (id) do update set doc = excluded.doc, updated_at = now(), updated_by = aid;
  return jsonb_build_object('ok', true);
exception when check_violation or not_null_violation then
  return jsonb_build_object('ok', false, 'error', 'doc_invalid');
end $$;

create function public.gp_texture_delete(p_code text, p_id text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
begin
  if public.gp_admin_id(p_code) is null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  delete from public.gp_textures where id = p_id;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.gp_content_get(), public.gp_admin_check(text), public.gp_level_save(text, text, jsonb), public.gp_level_reset(text, text),
  public.gp_level_history(text, text), public.gp_level_history_get(text, bigint), public.gp_texture_save(text, text, jsonb), public.gp_texture_delete(text, text) from public, authenticated;
grant execute on function public.gp_content_get(), public.gp_admin_check(text), public.gp_level_save(text, text, jsonb), public.gp_level_reset(text, text),
  public.gp_level_history(text, text), public.gp_level_history_get(text, bigint), public.gp_texture_save(text, text, jsonb), public.gp_texture_delete(text, text) to anon;

-- Donner le rôle admin à UN compte existant (remplacer le pseudo ; le code reste celui du compte) :
--   update public.profiles set is_admin = true where lower(pseudo) = lower('MON_PSEUDO');
