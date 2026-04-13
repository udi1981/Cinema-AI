# Supabase Setup for Cinema AI Studio

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New project"
3. Choose organization, name, password, and region
4. Wait for the project to finish provisioning

## 2. Enable Google OAuth

1. Go to **Authentication** > **Providers** > **Google**
2. Toggle **Enable Google provider**
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret into Supabase

## 3. Configure Redirect URLs

Go to **Authentication** > **URL Configuration**:
- Site URL: `https://ai-movie-creator.pages.dev`
- Redirect URLs (add all):
  - `https://ai-movie-creator.pages.dev`
  - `http://localhost:3000`
  - `http://localhost:5173`

## 4. Run the Database Migration

Go to **SQL Editor** and run the following:

```sql
-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free','basic','pro','studio','unlimited')),
  credits integer default 0,
  scenes_used integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- API Keys vault (per-user, encrypted at rest by Supabase)
create table public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null default 'gemini',
  key_hash text not null,
  encrypted_key text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.api_keys enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can only manage their own API keys
create policy "Users can view own keys" on public.api_keys
  for select using (auth.uid() = user_id);
create policy "Users can insert own keys" on public.api_keys
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own keys" on public.api_keys
  for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 5. Get Your API Keys

1. Go to **Settings** > **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 6. Configure Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

The app works without these variables — auth features will be disabled and existing functionality continues to work with localStorage.

## 7. Verify

1. Run `npm run dev`
2. Navigate to `#/auth`
3. Try signing in with Google
4. Check that your profile appears at `#/profile`
