-- Medical Records (Visits & EMR) Table Definition for Supabase (PostgreSQL)
-- Run this script in your Supabase SQL Editor.

DROP TABLE IF EXISTS public.medical_records CASCADE;

CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    visit_type TEXT DEFAULT 'checkup', -- 'checkup' (كشف) or 'follow_up' (استشارة/إعادة)
    diagnosis TEXT,
    prescription JSONB DEFAULT '[]'::jsonb, -- Array of [{ id, medication, strength, frequency, duration }]
    doctor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
CREATE POLICY "Users can view medical records for their clinic"
ON public.medical_records FOR SELECT
USING (clinic_id = (auth.jwt() -> 'user_metadata' ->> 'clinic_id')::uuid);

CREATE POLICY "Users can insert medical records for their clinic"
ON public.medical_records FOR INSERT
WITH CHECK (clinic_id = (auth.jwt() -> 'user_metadata' ->> 'clinic_id')::uuid);

CREATE POLICY "Users can update medical records for their clinic"
ON public.medical_records FOR UPDATE
USING (clinic_id = (auth.jwt() -> 'user_metadata' ->> 'clinic_id')::uuid);

CREATE POLICY "Users can delete medical records for their clinic"
ON public.medical_records FOR DELETE
USING (clinic_id = (auth.jwt() -> 'user_metadata' ->> 'clinic_id')::uuid);

-- Create performance indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_medical_records_clinic_id ON public.medical_records(clinic_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_phone ON public.medical_records(patient_phone);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON public.medical_records(created_at DESC);
