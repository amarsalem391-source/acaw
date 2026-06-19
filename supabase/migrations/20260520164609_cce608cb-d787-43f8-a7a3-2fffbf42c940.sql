
-- Lock down chat tables: remove permissive public read/update policies.
-- The chat edge function uses the service role which bypasses RLS, so no client needs direct read access.
DROP POLICY IF EXISTS "Allow public read conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Allow public update conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Allow public read messages" ON public.chat_messages;

-- Create app_role enum and user_roles table for admin access control.
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Restrict service_requests reads/updates/deletes to admins only.
DROP POLICY IF EXISTS "Admins can read service requests" ON public.service_requests;
CREATE POLICY "Admins can read service requests"
ON public.service_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update service requests" ON public.service_requests;
CREATE POLICY "Admins can update service requests"
ON public.service_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete service requests" ON public.service_requests;
CREATE POLICY "Admins can delete service requests"
ON public.service_requests FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add input validation constraints on service_requests.
ALTER TABLE public.service_requests
  DROP CONSTRAINT IF EXISTS service_requests_name_length,
  DROP CONSTRAINT IF EXISTS service_requests_email_format,
  DROP CONSTRAINT IF EXISTS service_requests_email_length,
  DROP CONSTRAINT IF EXISTS service_requests_phone_length,
  DROP CONSTRAINT IF EXISTS service_requests_description_length,
  DROP CONSTRAINT IF EXISTS service_requests_project_type_length,
  DROP CONSTRAINT IF EXISTS service_requests_budget_length;

ALTER TABLE public.service_requests
  ADD CONSTRAINT service_requests_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT service_requests_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT service_requests_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT service_requests_phone_length CHECK (phone IS NULL OR char_length(phone) <= 30),
  ADD CONSTRAINT service_requests_description_length CHECK (char_length(description) BETWEEN 1 AND 5000),
  ADD CONSTRAINT service_requests_project_type_length CHECK (char_length(project_type) BETWEEN 1 AND 100),
  ADD CONSTRAINT service_requests_budget_length CHECK (budget IS NULL OR char_length(budget) <= 100);
