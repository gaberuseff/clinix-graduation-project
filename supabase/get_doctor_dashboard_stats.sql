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
  v_total_bookings INT;
  v_pending_bookings INT;
  v_completed_bookings INT;
  v_cancelled_bookings INT;
  v_total_revenue NUMERIC;
  v_chart_data JSON;
  v_offset INTERVAL;
  v_period_start TIMESTAMPTZ;
BEGIN
  -- 1. Calculate the timezone offset dynamically
  v_offset := p_local_date::TIMESTAMP - (p_today_start AT TIME ZONE 'UTC');
  
  -- Calculate start of the filtered period in UTC
  v_period_start := (p_local_date - (p_days - 1) * INTERVAL '1 day')::TIMESTAMP - v_offset;

  -- 2. Filtered bookings count (over the last p_days days)
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE status = 'pending'),
         COUNT(*) FILTER (WHERE status = 'completed'),
         COUNT(*) FILTER (WHERE status = 'cancelled')
  INTO v_total_bookings, v_pending_bookings, v_completed_bookings, v_cancelled_bookings
  FROM appointments
  WHERE clinic_id = p_clinic_id
    AND date >= v_period_start
    AND date <= p_today_end;

  -- 3. Total revenue (sum of price of all completed bookings in the filtered period)
  SELECT COALESCE(SUM(price), 0)
  INTO v_total_revenue
  FROM appointments
  WHERE clinic_id = p_clinic_id
    AND status = 'completed'
    AND date >= v_period_start
    AND date <= p_today_end;

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
    'today_total_bookings', COALESCE(v_total_bookings, 0),
    'today_pending_bookings', COALESCE(v_pending_bookings, 0),
    'today_completed_bookings', COALESCE(v_completed_bookings, 0),
    'today_cancelled_bookings', COALESCE(v_cancelled_bookings, 0),
    'total_revenue', COALESCE(v_total_revenue, 0),
    'recent_bookings_chart', v_chart_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
