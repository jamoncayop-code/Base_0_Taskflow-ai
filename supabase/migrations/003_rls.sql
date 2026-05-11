-- Políticas para la tabla PUBLIC.PROFILES
drop policy if exists "profiles are publicly readable" on public.profiles;

create policy "profiles are publicly readable"
on public.profiles
for select
using (true);

drop policy if exists "users can update own profile" on public.profiles;

create policy "users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);


-- Políticas para la tabla PUBLIC.TASKS
drop policy if exists "users can read own tasks" on public.tasks;

create policy "users can read own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

drop policy if exists "users can insert own tasks" on public.tasks;

create policy "users can insert own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

drop policy if exists "users can update own tasks" on public.tasks;

create policy "users can update own tasks"
on public.tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete own tasks" on public.tasks;

create policy "users can delete own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);