-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing policies if they exist to avoid errors
DO $$ 
BEGIN
    -- Drop policies for marks_analysis
    IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for service role' AND polrelid = 'marks_analysis'::regclass) THEN
        DROP POLICY "Enable all for service role" ON marks_analysis;
    END IF;
    -- Drop policies for syllabus_analysis
    IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for service role' AND polrelid = 'syllabus_analysis'::regclass) THEN
        DROP POLICY "Enable all for service role" ON syllabus_analysis;
    END IF;
    -- Drop policies for assessments
    IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for service role' AND polrelid = 'assessments'::regclass) THEN
        DROP POLICY "Enable all for service role" ON assessments;
    END IF;
    -- Drop policies for feedback
    IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for service role' AND polrelid = 'feedback'::regclass) THEN
        DROP POLICY "Enable all for service role" ON feedback;
    END IF;
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

-- Table for storing study materials (PDF content)
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

-- 4. Ensure RLS is enabled
ALTER TABLE marks_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

-- 5. Re-create policies
CREATE POLICY "Enable all for service role" ON marks_analysis USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON syllabus_analysis USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON assessments USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON feedback USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON study_materials USING (true) WITH CHECK (true);
