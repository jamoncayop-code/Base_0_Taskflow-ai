-- Bloque para crear el tipo ENUM task_priority
do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'task_priority'
  ) then
    create type public.task_priority as enum (
      'low',
      'medium',
      'high',
      'critical'
    );
  end if;
end
$$;

-- Bloque para crear el tipo ENUM task_status
do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'task_status'
  ) then
    create type public.task_status as enum (
      'todo',
      'in_progress',
      'done',
      'archived'
    );
  end if;
end
$$;

-- Creación de la tabla tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'todo',
  position integer not null default 0,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Manejo del trigger para updated_at
drop trigger if exists set_tasks_updated_at on public.tasks;

create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

-- Creación de índice para optimizar consultas
create index if not exists tasks_user_id_status_idx
on public.tasks (user_id, status);

-- Habilitar RLS
alter table public.tasks enable row level security;