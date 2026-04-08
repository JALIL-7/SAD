-- 1. Newsletter table
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. News (Actualités) table
CREATE TABLE IF NOT EXISTS news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  media_url text, -- URL for images or video (can be from Supabase Storage or external link like YouTube)
  type text CHECK (type IN ('text', 'photo', 'video')) DEFAULT 'text',
  created_at timestamp with time zone DEFAULT now()
);

-- Note: Ensure that the RLS (Row Level Security) is set up in your Supabase dashboard
-- to allow anonymous users to INSERT into newsletter and contact_messages,
-- and allow only authenticated admins to CRUD the news table.
