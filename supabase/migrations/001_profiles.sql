-- Crear la tabla de perfiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Crear o reemplazar la función para actualizar el campo updated_at
create or replace function public.set_updated_at()
returns trigger 
language plpgsql
as $$
begin
  new.updated_at = now();
  return new; 
end;
$$;

-- Eliminar el disparador si ya existe
drop trigger if exists set_profiles_updated_at on public.profiles;

-- Crear el disparador (trigger)
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Habilitar la seguridad de nivel de fila (RLS)
alter table public.profiles enable row level security; 