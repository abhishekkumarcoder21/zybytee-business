# Supabase setup

Follow these steps in your Supabase project before running the app.

## 1) Create project

- Create a new Supabase project.
- Note the Project URL and anon public API key.

## 2) Add env vars

- Copy .env.example to .env.
- Set:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

## 3) Run schema SQL

- Open the SQL Editor in Supabase.
- Run supabase/schema.sql.

## 4) Enable auth providers

- Go to Authentication -> Providers.
- Enable Email.
- Enable Google and set OAuth credentials.
- Set redirect URLs:
  - https://business.zybytee.in/create
  - http://localhost:5173/create

## 5) Create profiles on signup (recommended)

- Go to Authentication -> Hooks.
- Enable "Insert profiles" or create a trigger that inserts into public.profiles on signup.

Example SQL:

create or replace function public.handle_new_user()
returns trigger as $$
begin
insert into public.profiles (id, email, full_name, avatar_url)
values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
on conflict do nothing;
return new;
end;

$$
language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

## 6) Storage
- Verify the "business-logos" bucket exists (created by schema.sql).
- If not, create it as public.

## 7) RLS policies
- Confirm Row Level Security is enabled on all tables.
- Verify policies from schema.sql exist.

## 8) Optional: seed data
- Use the business onboarding flow to add real businesses.

## 9) Domain settings
- Configure your custom domain in Supabase (optional).
- Make sure auth redirect URLs include your production domain.
$$
