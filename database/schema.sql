-- Supabase Database Schema for Think Before You Post
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'premium', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE risk_level AS ENUM ('none', 'low', 'medium', 'high');
CREATE TYPE content_type AS ENUM ('post', 'comment', 'story', 'dm', 'tweet');
CREATE TYPE platform_type AS ENUM ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'reddit', 'other');
CREATE TYPE analysis_recommendation AS ENUM ('safe', 'revise', 'danger');

-- Users table (extends Clerk auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  profession VARCHAR(100),
  industry VARCHAR(100),
  country VARCHAR(2) DEFAULT 'DE',
  language VARCHAR(5) DEFAULT 'de',
  onboarding_completed BOOLEAN DEFAULT false,
  risk_profile JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{"notifications": true, "emailAlerts": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Content analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_type content_type DEFAULT 'post',
  platform platform_type,
  overall_risk risk_level NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  recommendation analysis_recommendation NOT NULL,
  categories JSONB NOT NULL,
  suggestions TEXT[],
  improved_version TEXT,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  metadata JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Usage tracking table
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  analyses_count INTEGER DEFAULT 0,
  tier subscription_tier NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, date)
);

-- Team management table (for Premium/Enterprise)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(team_id, user_id)
);

-- Risk statistics table (aggregated data)
CREATE TABLE risk_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  total_analyses INTEGER DEFAULT 0,
  safe_posts INTEGER DEFAULT 0,
  revised_posts INTEGER DEFAULT 0,
  dangerous_posts INTEGER DEFAULT 0,
  average_risk_score DECIMAL(5, 2),
  categories_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, period, period_start)
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_overall_risk ON analyses(overall_risk);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_user_date ON usage_tracking(user_id, date);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_risk_statistics_user_period ON risk_statistics(user_id, period, period_start);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = clerk_id);

-- Analyses policies
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can create own analyses" ON analyses
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can update own analyses" ON analyses
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
  ));

-- Subscription policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
  ));

-- Team policies (members can view their teams)
CREATE POLICY "Team members can view team" ON teams
  FOR SELECT USING (
    owner_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
    OR
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
    )
  );

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier subscription_tier;
  v_count INTEGER;
  v_limit INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT s.tier INTO v_tier
  FROM subscriptions s
  WHERE s.user_id = p_user_id
  AND s.status = 'active';
  
  IF v_tier IS NULL THEN
    v_tier := 'free';
  END IF;
  
  -- Get today's usage count
  SELECT analyses_count INTO v_count
  FROM usage_tracking
  WHERE user_id = p_user_id
  AND date = CURRENT_DATE;
  
  IF v_count IS NULL THEN
    v_count := 0;
  END IF;
  
  -- Check limits based on tier
  CASE v_tier
    WHEN 'free' THEN v_limit := 10;
    WHEN 'pro' THEN v_limit := 999999; -- Unlimited
    WHEN 'premium' THEN v_limit := 999999; -- Unlimited
    WHEN 'enterprise' THEN v_limit := 999999; -- Unlimited
    ELSE v_limit := 10;
  END CASE;
  
  RETURN v_count < v_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_tier subscription_tier;
BEGIN
  -- Get user's subscription tier
  SELECT s.tier INTO v_tier
  FROM subscriptions s
  WHERE s.user_id = p_user_id
  AND s.status = 'active';
  
  IF v_tier IS NULL THEN
    v_tier := 'free';
  END IF;
  
  -- Insert or update usage count
  INSERT INTO usage_tracking (user_id, date, analyses_count, tier)
  VALUES (p_user_id, CURRENT_DATE, 1, v_tier)
  ON CONFLICT (user_id, date)
  DO UPDATE SET analyses_count = usage_tracking.analyses_count + 1;
END;
$$ LANGUAGE plpgsql;