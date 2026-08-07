import {supabase} from "./supabase";

/**
 * Fetch clinic financial statistics using PostgreSQL RPC function
 */
export async function getClinicFinancialStats({clinicId, startDate, endDate}) {
  if (!clinicId || !startDate || !endDate) return null;

  const {data, error} = await supabase.rpc("get_clinic_financial_stats", {
    p_clinic_id: clinicId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    console.error("Supabase getClinicFinancialStats error:", error);
    throw new Error(error.message || "Failed to load financial statistics");
  }

  return data;
}
