-- Business Hub by Zybytee schema
create extension if not exists "uuid-ossp";
-- Profiles table (user metadata)
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    email text,
    full_name text,
    avatar_url text,
    created_at timestamptz not null default now()
);
-- Businesses table
create table if not exists public.businesses (
    id uuid primary key default uuid_generate_v4(),
    owner_id uuid not null references public.profiles(id) on delete cascade,
    business_name text not null,
    slug text not null unique,
    logo_url text,
    founder_name text not null,
    business_email text,
    industry text not null,
    category text not null,
    description text not null,
    website text,
    country text not null,
    state text,
    city text not null,
    company_size text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
-- Business challenges table
create table if not exists public.business_challenges (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid not null references public.businesses(id) on delete cascade,
    challenge_name text not null
);
-- Social links table (one row per business)
create table if not exists public.social_links (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid not null references public.businesses(id) on delete cascade,
    linkedin text,
    instagram text,
    x text,
    youtube text,
    facebook text,
    unique (business_id)
);
-- Profile views table
create table if not exists public.profile_views (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid not null references public.businesses(id) on delete cascade,
    viewer_id uuid references public.profiles(id) on delete
    set null,
        viewed_at timestamptz not null default now()
);
-- Updated at trigger
create or replace function public.set_updated_at() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language plpgsql;
create trigger set_businesses_updated_at before
update on public.businesses for each row execute procedure public.set_updated_at();
-- RLS policies
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_challenges enable row level security;
alter table public.social_links enable row level security;
alter table public.profile_views enable row level security;
-- Profiles policies
create policy "Profiles are readable by anyone" on public.profiles for
select using (true);
create policy "Users can insert their profile" on public.profiles for
insert with check (auth.uid() = id);
create policy "Users can update their profile" on public.profiles for
update using (auth.uid() = id);
-- Businesses policies
create policy "Businesses are readable by anyone" on public.businesses for
select using (true);
create policy "Owners can insert businesses" on public.businesses for
insert with check (auth.uid() = owner_id);
create policy "Owners can update businesses" on public.businesses for
update using (auth.uid() = owner_id);
create policy "Owners can delete businesses" on public.businesses for delete using (auth.uid() = owner_id);
-- Business challenges policies
create policy "Challenges are readable by anyone" on public.business_challenges for
select using (true);
create policy "Owners can manage challenges" on public.business_challenges for all using (
    exists (
        select 1
        from public.businesses b
        where b.id = business_id
            and b.owner_id = auth.uid()
    )
);
-- Social links policies
create policy "Social links are readable by anyone" on public.social_links for
select using (true);
create policy "Owners can manage social links" on public.social_links for all using (
    exists (
        select 1
        from public.businesses b
        where b.id = business_id
            and b.owner_id = auth.uid()
    )
);
-- Profile views policies
create policy "Profile views insert" on public.profile_views for
insert with check (true);
create policy "Profile views read" on public.profile_views for
select using (true);
-- Storage bucket for logos
insert into storage.buckets (id, name, public)
values ('business-logos', 'business-logos', true) on conflict do nothing;
create policy "Logos are publicly readable" on storage.objects for
select using (bucket_id = 'business-logos');
create policy "Owners can upload logos" on storage.objects for
insert with check (
        bucket_id = 'business-logos'
        and auth.role() = 'authenticated'
    );
create policy "Owners can update logos" on storage.objects for
update using (
        bucket_id = 'business-logos'
        and auth.role() = 'authenticated'
    );