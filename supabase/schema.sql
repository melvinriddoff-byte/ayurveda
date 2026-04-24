-- ============================================================
-- VAIDYA — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  phone       text unique,
  dosha       text check (dosha in ('vata','pitta','kapha','vata-pitta','pitta-kapha','vata-kapha','tridosha')),
  role        text not null default 'patient' check (role in ('patient','hospital','doctor')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Hospitals
create table if not exists public.hospitals (
  id                 uuid default uuid_generate_v4() primary key,
  owner_id           uuid references public.profiles(id) on delete set null,
  name               text not null,
  tagline            text,
  description        text,
  location           text,
  city               text,
  state              text,
  phone              text,
  email              text,
  website            text,
  logo_url           text,
  cover_image_url    text,
  rating             numeric(3,2) default 0,
  review_count       integer default 0,
  verified           boolean default false,
  year_established   integer,
  accreditations     text[] default '{}',
  amenities          text[] default '{}',
  created_at         timestamptz not null default now()
);

-- Specialities
create table if not exists public.specialities (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null unique,
  description text,
  icon        text,
  color       text,
  sort_order  integer default 0
);

-- Doctors
create table if not exists public.doctors (
  id                uuid default uuid_generate_v4() primary key,
  hospital_id       uuid references public.hospitals(id) on delete cascade,
  profile_id        uuid references public.profiles(id) on delete set null,
  name              text not null,
  photo_url         text,
  title             text,
  bio               text,
  experience        integer default 0,
  education         text[] default '{}',
  languages         text[] default '{}',
  rating            numeric(3,2) default 0,
  review_count      integer default 0,
  consultation_fee  integer default 0,
  video_fee         integer default 0,
  available_days    text[] default '{}',
  next_available    date,
  accepts_video     boolean default true,
  dosha_expertise   text[] default '{}',
  created_at        timestamptz not null default now()
);

-- Doctor ↔ Speciality (many-to-many)
create table if not exists public.doctor_specialities (
  doctor_id     uuid references public.doctors(id) on delete cascade,
  speciality_id uuid references public.specialities(id) on delete cascade,
  primary key (doctor_id, speciality_id)
);

-- Appointments
create table if not exists public.appointments (
  id             uuid default uuid_generate_v4() primary key,
  patient_id     uuid references public.profiles(id) on delete cascade,
  doctor_id      uuid references public.doctors(id) on delete set null,
  hospital_id    uuid references public.hospitals(id) on delete set null,
  date           date not null,
  time           text not null,
  type           text not null check (type in ('in-person','video')),
  status         text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  notes          text,
  follow_up_date date,
  prescription   text,
  meeting_link   text,
  fee            integer default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Dosha assessments
create table if not exists public.dosha_assessments (
  id              uuid default uuid_generate_v4() primary key,
  patient_id      uuid references public.profiles(id) on delete cascade,
  dominant_dosha  text not null check (dominant_dosha in ('vata','pitta','kapha')),
  vata_score      integer default 0,
  pitta_score     integer default 0,
  kapha_score     integer default 0,
  answers         jsonb,
  taken_at        timestamptz not null default now()
);

-- ============================================================
-- TRIGGERS — updated_at auto-update
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_appointments_updated
  before update on public.appointments
  for each row execute function public.handle_updated_at();

-- Auto-create profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone, name, role)
  values (
    new.id,
    new.phone,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles          enable row level security;
alter table public.hospitals         enable row level security;
alter table public.specialities      enable row level security;
alter table public.doctors           enable row level security;
alter table public.doctor_specialities enable row level security;
alter table public.appointments      enable row level security;
alter table public.dosha_assessments enable row level security;

-- Profiles
create policy "profiles: public read"      on public.profiles for select using (true);
create policy "profiles: own insert"       on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: own update"       on public.profiles for update using (auth.uid() = id);

-- Hospitals (anyone can read, owner can write)
create policy "hospitals: public read"     on public.hospitals for select using (true);
create policy "hospitals: owner insert"    on public.hospitals for insert with check (auth.uid() = owner_id);
create policy "hospitals: owner update"    on public.hospitals for update using (auth.uid() = owner_id);

-- Specialities (public read, admins write — managed via service role)
create policy "specialities: public read"  on public.specialities for select using (true);

-- Doctors (public read, hospital owner can write)
create policy "doctors: public read"       on public.doctors for select using (true);
create policy "doctors: hospital insert"   on public.doctors for insert
  with check (exists (select 1 from public.hospitals where id = hospital_id and owner_id = auth.uid()));
create policy "doctors: hospital update"   on public.doctors for update
  using (exists (select 1 from public.hospitals where id = hospital_id and owner_id = auth.uid()));

-- Doctor specialities
create policy "doctor_spec: public read"   on public.doctor_specialities for select using (true);
create policy "doctor_spec: hospital write" on public.doctor_specialities for insert
  with check (exists (
    select 1 from public.doctors d
    join public.hospitals h on h.id = d.hospital_id
    where d.id = doctor_id and h.owner_id = auth.uid()
  ));

-- Appointments
create policy "appointments: patient read"  on public.appointments for select
  using (auth.uid() = patient_id);
create policy "appointments: patient insert" on public.appointments for insert
  with check (auth.uid() = patient_id);
create policy "appointments: patient update" on public.appointments for update
  using (auth.uid() = patient_id);
create policy "appointments: doctor read"   on public.appointments for select
  using (exists (select 1 from public.doctors where id = doctor_id and profile_id = auth.uid()));

-- Dosha assessments
create policy "dosha: own read"    on public.dosha_assessments for select using (auth.uid() = patient_id);
create policy "dosha: own insert"  on public.dosha_assessments for insert with check (auth.uid() = patient_id);

-- ============================================================
-- SEED DATA — Specialities
-- ============================================================

insert into public.specialities (name, description, icon, color, sort_order) values
  ('Panchakarma',                   'Five-fold purification therapy that eliminates toxins and deeply rejuvenates the body.',              '🫧', 'bg-blue-50 border-blue-100',     1),
  ('Rasayana (Rejuvenation)',        'Anti-ageing and vitality-enhancing treatments using classical herbal formulations.',                  '✨', 'bg-purple-50 border-purple-100', 2),
  ('Kayachikitsa (General Medicine)','Classical Ayurvedic internal medicine addressing metabolic and chronic diseases.',                    '💊', 'bg-saffron-50 border-saffron-100',3),
  ('Shalya Tantra (Surgery)',        'Ancient surgical procedures combined with herbal and minimally invasive techniques.',                 '🔪', 'bg-red-50 border-red-100',       4),
  ('Stri Roga (Gynecology)',         "Women's health: hormonal balance, fertility, prenatal care and menstrual disorders.",                 '🌸', 'bg-pink-50 border-pink-100',     5),
  ('Kaumarabhritya (Pediatrics)',    'Specialised Ayurvedic care for infants and children through adolescence.',                           '👶', 'bg-yellow-50 border-yellow-100', 6),
  ('Manasaroga (Psychiatry)',        'Mental health via Sattvavajaya Chikitsa, herbs, and meditative practices.',                          '🧠', 'bg-indigo-50 border-indigo-100', 7),
  ('Shalakya (ENT & Ophthalmology)', 'Treatments for eye, ear, nose and throat using Nasya, Netra Tarpana and other procedures.',          '👁️', 'bg-teal-50 border-teal-100',     8),
  ('Agada Tantra (Toxicology)',      'Detoxification therapies for toxic conditions, food poisoning and environmental exposures.',          '🧪', 'bg-orange-50 border-orange-100', 9),
  ('Nidana (Diagnostics)',           'Comprehensive diagnosis using pulse reading (Nadi Pariksha), tongue analysis and classical methods.', '🔍', 'bg-stone-50 border-stone-200',   10),
  ('Marma Therapy',                  'Energy point therapy targeting 107 vital points to restore pranic flow and treat pain.',              '⚡', 'bg-amber-50 border-amber-100',   11),
  ('Yoga & Naturopathy',             'Integrated yoga therapy, pranayama and naturopathic treatments for holistic wellness.',               '🧘', 'bg-herbal-50 border-herbal-100', 12)
on conflict (name) do nothing;

-- ============================================================
-- SEED DATA — Hospitals
-- ============================================================

insert into public.hospitals (id, name, tagline, description, location, city, state, phone, email, website, logo_url, cover_image_url, rating, review_count, verified, year_established, accreditations, amenities)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Arya Vaidya Sala',
    'A century of healing. A tradition of trust.',
    'Established in 1902, Arya Vaidya Sala Kottakkal is one of India''s most iconic Ayurvedic institutions. It manufactures over 550 classical formulations and operates hospitals, pharmacies, and research centres across India.',
    'Kottakkal, Malappuram', 'Kottakkal', 'Kerala',
    '+91 483 274 2216', 'info@aryavaidyasala.com', 'https://www.aryavaidyasala.com',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&h=400&fit=crop',
    4.9, 1842, true, 1902,
    ARRAY['NABH','ISO 9001:2015','WHO-GMP'],
    ARRAY['In-patient Rooms','Treatment Halls','Herbal Garden','Yoga Pavilion','Pharmacy','Canteen']
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Somatheeram Ayurveda Resort',
    'Kerala''s first Ayurveda resort — healing by the sea.',
    'Somatheeram is the world''s first Ayurveda resort, perched on a cliff overlooking the Arabian Sea. It offers authentic Panchakarma, wellness packages, and medical treatments in a serene tropical setting.',
    'Chowara Beach, Thiruvananthapuram', 'Thiruvananthapuram', 'Kerala',
    '+91 471 226 6501', 'info@somatheeram.org', 'https://www.somatheeram.org',
    'https://images.unsplash.com/photo-1545579133-99bb5ad189be?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=400&fit=crop',
    4.8, 976, true, 1987,
    ARRAY['NABH','Kerala Tourism Gold Label'],
    ARRAY['Sea-view Rooms','Treatment Cottages','Yoga Hall','Meditation Garden','Swimming Pool','Organic Restaurant']
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Kairali Ayurvedic Health Village',
    'Retreat. Restore. Rejuvenate.',
    'Set on 50 acres of lush greenery in Palakkad, Kairali offers holistic healing programmes combining Panchakarma, Yoga, and meditation.',
    'Kodumbu, Palakkad', 'Palakkad', 'Kerala',
    '+91 492 221 0022', 'kairali@kairali.com', 'https://www.kairali.com',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&h=400&fit=crop',
    4.7, 1103, true, 1989,
    ARRAY['NABH','National Tourism Award','Condé Nast Traveller Recommendation'],
    ARRAY['Eco Cottages','Herbal Farm','Yoga Centre','Ayurveda Spa','Naturopathy Centre','Restaurant']
  )
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Doctors
-- ============================================================

insert into public.doctors (id, hospital_id, name, photo_url, title, bio, experience, education, languages, rating, review_count, consultation_fee, video_fee, available_days, next_available, accepts_video, dosha_expertise)
values
  (
    'b1c2d3e4-0001-0001-0001-000000000001',
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Dr. Priya Nambiar',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    'MD (Ayurveda), PhD',
    'Dr. Nambiar has over 18 years of experience in classical Ayurvedic treatments, specialising in chronic disease management and Panchakarma detox therapies.',
    18,
    ARRAY['BAMS – Kerala University','MD Kayachikitsa – RGUHS','PhD in Panchakarma – NIA Jaipur'],
    ARRAY['English','Malayalam','Hindi'],
    4.9, 312, 800, 600,
    ARRAY['Mon','Tue','Thu','Fri'],
    current_date + interval '1 day',
    true,
    ARRAY['vata','pitta']
  ),
  (
    'b1c2d3e4-0002-0002-0002-000000000002',
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Dr. Rajesh Menon',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    'BAMS, MD (Panchakarma)',
    'A passionate Marma therapist and Panchakarma specialist, Dr. Menon blends ancient wisdom with modern diagnostics. He has treated patients from 40+ countries.',
    12,
    ARRAY['BAMS – University of Calicut','MD Panchakarma – Manipal University'],
    ARRAY['English','Malayalam','Tamil'],
    4.7, 198, 700, 500,
    ARRAY['Mon','Wed','Fri','Sat'],
    current_date + interval '2 days',
    true,
    ARRAY['kapha','vata']
  ),
  (
    'b1c2d3e4-0003-0003-0003-000000000003',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Dr. Lakshmi Varma',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    'BAMS, PG Diploma Panchakarma',
    'Dr. Varma is a women''s health specialist with deep expertise in hormonal balance, fertility support, and paediatric Ayurveda.',
    10,
    ARRAY['BAMS – Amrita School of Ayurveda','PG Diploma in Panchakarma – NIA Jaipur'],
    ARRAY['English','Malayalam','Kannada'],
    4.8, 245, 900, 700,
    ARRAY['Tue','Wed','Thu','Sat'],
    current_date + interval '3 days',
    true,
    ARRAY['pitta','kapha']
  ),
  (
    'b1c2d3e4-0004-0004-0004-000000000004',
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Dr. Suresh Kumar',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    'MD (Kayachikitsa)',
    'Dr. Kumar is a tridosha specialist with a background in both Ayurvedic and integrative medicine. He excels at complex chronic cases and mental health support.',
    20,
    ARRAY['BAMS – Gujarat Ayurved University','MD Kayachikitsa – BHU Varanasi'],
    ARRAY['English','Hindi','Gujarati'],
    4.9, 421, 1200, 900,
    ARRAY['Mon','Tue','Wed','Thu'],
    current_date + interval '1 day',
    true,
    ARRAY['vata','pitta','kapha']
  ),
  (
    'b1c2d3e4-0005-0005-0005-000000000005',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Dr. Anitha Krishnan',
    'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop',
    'BAMS, Cert. Marma Therapy',
    'Specialising in pain management and neurological disorders through Marma Therapy, Dr. Krishnan combines traditional Kalari techniques with Ayurvedic protocols.',
    8,
    ARRAY['BAMS – VPSV Ayurveda College','Cert. in Marma Therapy – Kottakal'],
    ARRAY['English','Tamil','Telugu'],
    4.6, 134, 650, 500,
    ARRAY['Mon','Thu','Fri','Sat'],
    current_date + interval '4 days',
    false,
    ARRAY['vata','kapha']
  )
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Doctor ↔ Speciality links
-- ============================================================

-- Dr. Priya Nambiar
insert into public.doctor_specialities (doctor_id, speciality_id)
select 'b1c2d3e4-0001-0001-0001-000000000001', id from public.specialities
where name in ('Panchakarma','Rasayana (Rejuvenation)','Kayachikitsa (General Medicine)')
on conflict do nothing;

-- Dr. Rajesh Menon
insert into public.doctor_specialities (doctor_id, speciality_id)
select 'b1c2d3e4-0002-0002-0002-000000000002', id from public.specialities
where name in ('Panchakarma','Marma Therapy','Yoga & Naturopathy')
on conflict do nothing;

-- Dr. Lakshmi Varma
insert into public.doctor_specialities (doctor_id, speciality_id)
select 'b1c2d3e4-0003-0003-0003-000000000003', id from public.specialities
where name in ('Rasayana (Rejuvenation)','Stri Roga (Gynecology)','Kaumarabhritya (Pediatrics)')
on conflict do nothing;

-- Dr. Suresh Kumar
insert into public.doctor_specialities (doctor_id, speciality_id)
select 'b1c2d3e4-0004-0004-0004-000000000004', id from public.specialities
where name in ('Kayachikitsa (General Medicine)','Manasaroga (Psychiatry)','Nidana (Diagnostics)')
on conflict do nothing;

-- Dr. Anitha Krishnan
insert into public.doctor_specialities (doctor_id, speciality_id)
select 'b1c2d3e4-0005-0005-0005-000000000005', id from public.specialities
where name in ('Marma Therapy','Panchakarma','Yoga & Naturopathy')
on conflict do nothing;
