import {supabase} from "./supabase";

export async function getDoctorDashboardStats({clinicId, todayStart, todayEnd, localDate, days}) {
  const {data, error} = await supabase.rpc("get_doctor_dashboard_stats", {
    p_clinic_id: clinicId,
    p_today_start: todayStart,
    p_today_end: todayEnd,
    p_local_date: localDate,
    p_days: days,
  });

  if (error) {
    console.error("Supabase get_doctor_dashboard_stats RPC error:", error);
    throw new Error(error.message || "Failed to load dashboard stats");
  }

  return data;
}

export async function getSecretaryDashboardStats({clinicId, todayStart, todayEnd}) {
  const {data, error} = await supabase.rpc("get_secretary_dashboard_stats", {
    p_clinic_id: clinicId,
    p_today_start: todayStart,
    p_today_end: todayEnd,
  });

  if (error) {
    console.error("Supabase get_secretary_dashboard_stats RPC error:", error);
    throw new Error(error.message || "Failed to load secretary dashboard stats");
  }

  return data;
}
