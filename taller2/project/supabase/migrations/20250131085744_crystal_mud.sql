/*
  # Auto Repair Shop Database Schema

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `license_plate` (text, unique)
      - `brand` (text)
      - `model` (text)
      - `year` (integer)
      - `client_name` (text)
      - `phone_number` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `repairs`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key)
      - `description` (text)
      - `cost` (decimal)
      - `is_warning` (boolean)
      - `status` (enum)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `work_orders`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key)
      - `date` (timestamp)
      - `status` (enum)
      - `total_cost` (decimal)
      - `signature` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE repair_status AS ENUM ('pending', 'in_progress', 'completed', 'warning');
CREATE TYPE work_order_status AS ENUM ('pending', 'approved', 'in_progress', 'completed');

-- Create vehicles table
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  client_name text NOT NULL,
  phone_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create repairs table
CREATE TABLE repairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  cost decimal(10,2) DEFAULT 0,
  is_warning boolean DEFAULT false,
  status repair_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create work_orders table
CREATE TABLE work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  date timestamptz DEFAULT now(),
  status work_order_status DEFAULT 'pending',
  total_cost decimal(10,2) DEFAULT 0,
  signature text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own repairs"
  ON repairs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own repairs"
  ON repairs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own work orders"
  ON work_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own work orders"
  ON work_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);