-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing policies safely
DO $$ 
DECLARE
    pol_record RECORD;
BEGIN
    FOR pol_record IN 
        SELECT p.polname, c.relname
        FROM pg_policy p
        JOIN pg_class c ON p.polrelid = c.oid
        WHERE p.polname = 'Enable all for service role'
        AND c.relname IN ('marks_analysis', 'syllabus_analysis', 'assessments', 'feedback', 'study_materials', 'attendance', 'students')
    LOOP
        EXECUTE format('DROP POLICY %I ON %I', pol_record.polname, pol_record.relname);
    END LOOP;
END $$;

-- 3. Create tables (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    subject TEXT
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS marks_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    average_score FLOAT,
    risk_students_count INTEGER,
    performance_summary TEXT
);

CREATE TABLE IF NOT EXISTS syllabus_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    major_topics JSONB,
    assessment_focus JSONB
);

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    subject TEXT,
    unit TEXT,
    data JSONB
);

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    student_name TEXT,
    score FLOAT,
    feedback_data JSONB
);

CREATE TABLE IF NOT EXISTS study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    subject TEXT NOT NULL,
    unit TEXT NOT NULL,
    title TEXT,
    content_text TEXT NOT NULL,
    file_name TEXT,
    word_count INTEGER
);

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    student_name TEXT NOT NULL,
    attendance_date DATE NOT NULL,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Late')),
    subject TEXT
);

-- 4. Ensure RLS is enabled
ALTER TABLE marks_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for all tables
CREATE POLICY "Enable all for service role" ON marks_analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON syllabus_analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON study_materials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON students FOR ALL USING (true) WITH CHECK (true);