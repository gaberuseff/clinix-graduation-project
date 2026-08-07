-- Migration: Create clinic financial statistics function for Supabase (PostgreSQL)
-- Timestamp: 20260805000000

CREATE OR REPLACE FUNCTION public.get_clinic_financial_stats(
  p_clinic_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_completed_count INT;
  v_completed_revenue NUMERIC;
  v_cancelled_count INT;
  v_cancelled_revenue NUMERIC;
  v_pending_count INT;
  v_pending_revenue NUMERIC;
  v_checkup_count INT;
  v_checkup_revenue NUMERIC;
  v_followup_count INT;
  v_followup_revenue NUMERIC;
  v_chart_data JSON;
  v_recent_transactions JSON;
BEGIN
  -- 1. Completed Bookings Count and Sum
  SELECT COUNT(*), COALESCE(SUM(price), 0)
  INTO v_completed_count, v_completed_revenue
  FROM public.appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'completed'
    AND date >= p_start_date
    AND date <= p_end_date;

  -- 2. Cancelled Bookings Count and Sum (Revenue lost or refunded)
  SELECT COUNT(*), COALESCE(SUM(price), 0)
  INTO v_cancelled_count, v_cancelled_revenue
  FROM public.appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'cancelled'
    AND date >= p_start_date
    AND date <= p_end_date;

  -- 3. Pending Bookings Count and Sum (Expected upcoming revenue)
  SELECT COUNT(*), COALESCE(SUM(price), 0)
  INTO v_pending_count, v_pending_revenue
  FROM public.appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'pending'
    AND date >= p_start_date
    AND date <= p_end_date;

  -- 4. Checkup vs Follow-up breakdown for completed bookings in range
  SELECT 
    COUNT(*) FILTER (WHERE type = 'checkup'),
    COALESCE(SUM(price) FILTER (WHERE type = 'checkup'), 0),
    COUNT(*) FILTER (WHERE type = 'follow_up'),
    COALESCE(SUM(price) FILTER (WHERE type = 'follow_up'), 0)
  INTO v_checkup_count, v_checkup_revenue, v_followup_count, v_followup_revenue
  FROM public.appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'completed'
    AND date >= p_start_date
    AND date <= p_end_date;

  -- 5. Daily trend chart data (revenue over time)
  SELECT COALESCE(json_agg(t), '[]'::json)
  INTO v_chart_data
  FROM (
    SELECT 
      (date AT TIME ZONE 'UTC')::DATE::TEXT AS day,
      COUNT(id) AS total_count,
      COUNT(id) FILTER (WHERE status = 'completed') AS completed_count,
      COALESCE(SUM(price) FILTER (WHERE status = 'completed'), 0) AS revenue
    FROM public.appointments
    WHERE clinic_id = p_clinic_id
      AND date >= p_start_date
      AND date <= p_end_date
    GROUP BY (date AT TIME ZONE 'UTC')::DATE
    ORDER BY (date AT TIME ZONE 'UTC')::DATE ASC
  ) t;

  -- 6. Recent transactions listing (latest 50 bookings in range)
  SELECT COALESCE(json_agg(t), '[]'::json)
  INTO v_recent_transactions
  FROM (
    SELECT 
      id,
      name AS patient_name,
      phone AS patient_phone,
      type AS visit_type,
      price,
      status,
      date
    FROM public.appointments
    WHERE clinic_id = p_clinic_id
      AND date >= p_start_date
      AND date <= p_end_date
    ORDER BY date DESC
    LIMIT 50
  ) t;

  -- 7. Construct and return final JSON response object
  RETURN json_build_object(
    'completed_count', v_completed_count,
    'completed_revenue', v_completed_revenue,
    'cancelled_count', v_cancelled_count,
    'cancelled_revenue', v_cancelled_revenue,
    'pending_count', v_pending_count,
    'pending_revenue', v_pending_revenue,
    'checkup_count', v_checkup_count,
    'checkup_revenue', v_checkup_revenue,
    'followup_count', v_followup_count,
    'followup_revenue', v_followup_revenue,
    'chart_data', v_chart_data,
    'recent_transactions', v_recent_transactions
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
