-- Create agent_actions table for logging all agent activities
CREATE TABLE IF NOT EXISTS public.agent_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  explanation TEXT,
  confidence_score FLOAT,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agent_actions_user_id ON public.agent_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_created_at ON public.agent_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_actions_agent_name ON public.agent_actions(agent_name);

-- Set up RLS policies for agent_actions
CREATE POLICY "Users can view their own agent actions"
  ON public.agent_actions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent actions"
  ON public.agent_actions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Set up RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER update_agent_actions_updated_at
BEFORE UPDATE ON public.agent_actions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
