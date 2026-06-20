
-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text, avatar_url text, phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid()=user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- COURSES
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL, description text, category text,
  price numeric DEFAULT 0, thumbnail_url text,
  status text NOT NULL DEFAULT 'draft',
  reject_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_select" ON public.courses FOR SELECT TO authenticated USING (status='approved' OR instructor_id=auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "courses_insert" ON public.courses FOR INSERT TO authenticated WITH CHECK (instructor_id=auth.uid() AND (public.has_role(auth.uid(),'instructor') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')));
CREATE POLICY "courses_update" ON public.courses FOR UPDATE TO authenticated USING (instructor_id=auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')) WITH CHECK (instructor_id=auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "courses_delete" ON public.courses FOR DELETE TO authenticated USING (instructor_id=auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LESSONS
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL, description text, video_url text,
  order_index int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  reject_reason text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_select" ON public.lessons FOR SELECT TO authenticated USING (
  status='approved'
  OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id=lessons.course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);
CREATE POLICY "lessons_insert" ON public.lessons FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id=course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);
CREATE POLICY "lessons_update" ON public.lessons FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id=lessons.course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id=lessons.course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);
CREATE POLICY "lessons_delete" ON public.lessons FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id=lessons.course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PARENT_CHILDREN (before enrollments since enrollments policy references it)
CREATE TABLE public.parent_children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.parent_children TO authenticated;
GRANT ALL ON public.parent_children TO service_role;
ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pc_select" ON public.parent_children FOR SELECT TO authenticated USING (parent_id=auth.uid() OR student_id=auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "pc_insert" ON public.parent_children FOR INSERT TO authenticated WITH CHECK (parent_id=auth.uid());
CREATE POLICY "pc_delete" ON public.parent_children FOR DELETE TO authenticated USING (parent_id=auth.uid());

-- ENROLLMENTS
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress int NOT NULL DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enr_select" ON public.enrollments FOR SELECT TO authenticated USING (
  student_id=auth.uid()
  OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id=enrollments.course_id AND c.instructor_id=auth.uid())
  OR EXISTS (SELECT 1 FROM public.parent_children pc WHERE pc.student_id=enrollments.student_id AND pc.parent_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);
CREATE POLICY "enr_insert" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (student_id=auth.uid());
CREATE POLICY "enr_update" ON public.enrollments FOR UPDATE TO authenticated USING (student_id=auth.uid()) WITH CHECK (student_id=auth.uid());

-- ASSIGNMENTS
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL, description text, due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ass_select" ON public.assignments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.enrollments e WHERE e.course_id=assignments.course_id AND e.student_id=auth.uid())
  OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id=assignments.course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);
CREATE POLICY "ass_write" ON public.assignments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id=assignments.course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id=course_id AND c.instructor_id=auth.uid())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL, body text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select" ON public.notifications FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE POLICY "notif_update" ON public.notifications FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
