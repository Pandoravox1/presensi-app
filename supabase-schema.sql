-- Basic schema for attendance app
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  homeroom_class text,
  gender text,
  roll_number text,
  avatar_url text
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  schedule text not null
);

create table if not exists class_students (
  class_id uuid references classes on delete cascade,
  student_id uuid references students on delete cascade,
  primary key (class_id, student_id)
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes on delete cascade,
  student_id uuid references students on delete cascade,
  date date not null,
  status text not null, -- 'Hadir'/'Absen'/'Terlambat'/'Izin'
  notes text,
  unique (class_id, student_id, date)
);

-- Enable RLS
alter table students enable row level security;
alter table classes enable row level security;
alter table class_students enable row level security;
alter table attendance enable row level security;

-- Fast, permissive policies for anon key (adjust as needed)
create policy "anon all students" on students for all using (true) with check (true);
create policy "anon all classes" on classes for all using (true) with check (true);
create policy "anon all class_students" on class_students for all using (true) with check (true);
create policy "anon all attendance" on attendance for all using (true) with check (true);

-- If you prefer anon read-only, comment the policies above and use these instead:
-- create policy "anon select students" on students for select using (true);
-- create policy "anon select classes" on classes for select using (true);
-- create policy "anon select class_students" on class_students for select using (true);
-- create policy "anon select attendance" on attendance for select using (true);
-- Then put inserts/updates/deletes behind a service-role proxy (Edge Function/API Route) that includes your service key.
