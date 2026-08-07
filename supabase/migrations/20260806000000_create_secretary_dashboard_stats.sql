-- Migration: Create get_secretary_dashboard_stats database function
-- Timestamp: 20260806000000

CREATE OR REPLACE FUNCTION public.get_secretary_dashboard_stats(
  p_clinic_id UUID,
  p_today_start TIMESTAMPTZ,
  p_today_end TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_today_total INT;
  v_today_pending INT;
  v_today_completed INT;
  v_today_cancelled INT;
  v_today_revenue NUMERIC;
  v_total_patients INT;
  v_today_appointments JSON;
  v_recent_patients JSON;
BEGIN
  -- 1. Today's bookings count
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE status = 'pending'),
         COUNT(*) FILTER (WHERE status = 'completed'),
         COUNT(*) FILTER (WHERE status = 'cancelled')
  INTO v_today_total, v_today_pending, v_today_completed, v_today_cancelled
  FROM public.appointments
  WHERE clinic_id = p_clinic_id
    AND date >= p_today_start
    AND date <= p_today_end;

  -- 2. Today's revenue (sum of price of completed bookings today)
  SELECT COALESCE(SUM(price), 0)
  INTO v_today_revenue
  FROM public.appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'completed'
    AND date >= p_today_start
    AND date <= p_today_end;

  -- 3. Total active patients in the clinic
  SELECT COUNT(*)
  INTO v_total_patients
  FROM public.patients
  WHERE clinic_id = p_clinic_id
    AND is_active = true;

  -- 4. Today's appointments list (ordered by date ascending, i.e., earliest first)
  SELECT COALESCE(json_agg(t), '[]'::json)
  INTO v_today_appointments
  FROM (
    SELECT id, name, phone, type, price, date, status
    FROM public.appointments
    WHERE clinic_id = p_clinic_id
      AND date >= p_today_start
      AND date <= p_today_end
    ORDER BY date ASC
  ) t;

  -- 5. Recent patients list (last 5 active patients registered)
  SELECT COALESCE(json_agg(p), '[]'::json)
  INTO v_recent_patients
  FROM (
    SELECT id, name, phone, created_at
    FROM public.patients
    WHERE clinic_id = p_clinic_id
      AND is_active = true
    ORDER BY created_at DESC
    LIMIT 5
  ) p;

  -- 6. Return as JSON
  RETURN json_build_object(
    'today_total_bookings', COALESCE(v_today_total, 0),
    'today_pending_bookings', COALESCE(v_today_pending, 0),
    'today_completed_bookings', COALESCE(v_today_completed, 0),
    'today_cancelled_bookings', COALESCE(v_today_cancelled, 0),
    'today_revenue', COALESCE(v_today_revenue, 0),
    'total_patients', COALESCE(v_total_patients, 0),
    'today_appointments', v_today_appointments,
    'recent_patients', v_recent_patients
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
