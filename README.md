<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1PG9WIg1CsnGHvee72a9F_2ObWa_RKUtL

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set env vars in [.env.local](.env.local):
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Run the app:
   `npm run dev`

## Supabase tables (minimal)

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll_number text unique not null,
  avatar_url text
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  schedule text not null
);

create table class_students (
  class_id uuid references classes on delete cascade,
  student_id uuid references students on delete cascade,
  primary key (class_id, student_id)
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes on delete cascade,
  student_id uuid references students on delete cascade,
  date date not null,
  status text not null, -- 'Hadir'/'Absen'/'Terlambat'/'Izin'
  notes text,
  unique (class_id, student_id, date)
);
```
