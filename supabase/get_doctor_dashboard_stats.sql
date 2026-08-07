-- Run this script in your Supabase SQL Editor to update the dashboard statistics function with local date and custom range filtering.

CREATE OR REPLACE FUNCTION get_doctor_dashboard_stats(
  p_clinic_id UUID,
  p_today_start TIMESTAMPTZ,
  p_today_end TIMESTAMPTZ,
  p_local_date DATE,
  p_days INT
)
RETURNS JSON AS $$
DECLARE
  v_today_total INT;
  v_today_pending INT;
  v_today_completed INT;
  v_today_cancelled INT;
  v_total_revenue NUMERIC;
  v_chart_data JSON;
  v_offset INTERVAL;
BEGIN
  -- 1. Calculate the timezone offset dynamically
  v_offset := p_local_date::TIMESTAMP - (p_today_start AT TIME ZONE 'UTC');

  -- 2. Today's bookings count
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE status = 'pending'),
         COUNT(*) FILTER (WHERE status = 'completed'),
         COUNT(*) FILTER (WHERE status = 'cancelled')
  INTO v_today_total, v_today_pending, v_today_completed, v_today_cancelled
  FROM appointments
  WHERE clinic_id = p_clinic_id
    AND date >= p_today_start
    AND date <= p_today_end;

  -- 3. Total revenue (sum of price of all completed bookings)
  SELECT COALESCE(SUM(price), 0)
  INTO v_total_revenue
  FROM appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'completed';

  -- 4. Recent bookings chart (last p_days days using index-friendly timezone offset)
  SELECT COALESCE(json_agg(t), '[]'::json)
  INTO v_chart_data
  FROM (
    SELECT 
      d.day::DATE AS date,
      COUNT(a.id) AS count,
      COUNT(a.id) FILTER (WHERE a.status = 'completed') AS completed_count
    FROM (
      SELECT generate_series(
        p_local_date - (p_days - 1) * INTERVAL '1 day',
        p_local_date,
        '1 day'::interval
      )::DATE AS day
    ) d
    LEFT JOIN appointments a 
      ON a.clinic_id = p_clinic_id 
      AND a.date >= d.day - v_offset
      AND a.date < d.day - v_offset + INTERVAL '1 day'
    GROUP BY d.day
    ORDER BY d.day ASC
  ) t;

  -- 5. Return as JSON
  RETURN json_build_object(
    'today_total_bookings', COALESCE(v_today_total, 0),
    'today_pending_bookings', COALESCE(v_today_pending, 0),
    'today_completed_bookings', COALESCE(v_today_completed, 0),
    'today_cancelled_bookings', COALESCE(v_today_cancelled, 0),
    'total_revenue', COALESCE(v_total_revenue, 0),
    'recent_bookings_chart', v_chart_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
