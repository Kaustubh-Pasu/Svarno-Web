# Supabase Database Setup Guide

This guide will help you set up the necessary database tables for the Svarno application.

## Prerequisites

1. A Supabase project (already configured in the app)
2. Access to your Supabase dashboard

## Database Schema

### 1. Users Table

Create the following table in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 18),
  email TEXT NOT NULL,
  profile_picture TEXT,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  certificates JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, age, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 16),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Optional: Additional Tables

If you want to extend the application with more features, you can create these additional tables:

```sql
-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'expense', 'income')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  symbol TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  color TEXT DEFAULT '#10B981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for these tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for budgets
CREATE POLICY "Users can manage own budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id);
```

## Testing the Setup

1. Visit `/test-auth` in your application to test the database connection
2. Try signing up with a new account at `/auth`
3. Check if the user is created in the `users` table in your Supabase dashboard

## Troubleshooting

### Common Issues

1. **"relation 'users' does not exist"**
   - Run the SQL schema above in your Supabase SQL editor

2. **"permission denied for table users"**
   - Make sure RLS policies are created correctly
   - Check that the user is authenticated

3. **"duplicate key value violates unique constraint"**
   - The user already exists in the database
   - This is normal for existing users

### Verification Steps

1. Check that the `users` table exists in your Supabase dashboard
2. Verify that RLS is enabled and policies are created
3. Test user registration and login
4. Check that user data appears in the `users` table after registration

## Next Steps

Once the database is set up:

1. Test user registration at `/auth`
2. Test user login
3. Verify that the dashboard loads with user data
4. Test the authentication flow end-to-end

The application will work even without the database tables (using mock data), but for full functionality, the `users` table is recommended.









