import {supabase} from "./supabase";

/**
 * Fetch medical records / visits for a patient by phone number within a clinic
 */
export async function getPatientMedicalRecords({clinicId, phone}) {
  if (!clinicId || !phone) return [];

  const cleanPhone = String(phone).trim();

  const {data, error} = await supabase
    .from("medical_records")
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("patient_phone", cleanPhone)
    .order("created_at", {ascending: false});

  if (error) {
    console.error("Supabase getPatientMedicalRecords error:", error);
    throw new Error(error.message || "Failed to fetch patient medical records");
  }

  return data || [];
}

/**
 * Create a new medical record / visit entry
 */
export async function createMedicalRecord(visitData) {
  const {data, error} = await supabase
    .from("medical_records")
    .insert([visitData])
    .select()
    .single();

  if (error) {
    console.error("Supabase createMedicalRecord error:", error);
    throw new Error(error.message || "Failed to create medical record");
  }

  return data;
}

/**
 * Update an existing medical record
 */
export async function updateMedicalRecord({id, updatedFields}) {
  const {data, error} = await supabase
    .from("medical_records")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateMedicalRecord error:", error);
    throw new Error(error.message || "Failed to update medical record");
  }

  return data;
}

/**
 * Delete a medical record by ID
 */
export async function deleteMedicalRecord({id}) {
  const {data, error} = await supabase
    .from("medical_records")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase deleteMedicalRecord error:", error);
    throw new Error(error.message || "Failed to delete medical record");
  }

  return data;
}

/**
 * Search patients by phone number to retrieve patient details
 */
export async function findPatientByPhone({clinicId, phone}) {
  if (!clinicId || !phone) return null;

  const cleanPhone = String(phone).trim();

  const {data, error} = await supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("phone", cleanPhone)
    .maybeSingle();

  if (error) {
    console.error("Supabase findPatientByPhone error:", error);
    return null;
  }

  return data;
}

/**
 * Fetch all medical records / visits completed today for the active clinic
 */
export async function getTodayVisits({clinicId}) {
  if (!clinicId) return [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

  const {data, error} = await supabase
    .from("medical_records")
    .select("*")
    .eq("clinic_id", clinicId)
    .gte("created_at", todayStart)
    .lte("created_at", todayEnd)
    .order("created_at", {ascending: false});

  if (error) {
    console.error("Supabase getTodayVisits error:", error);
    throw new Error(error.message || "Failed to fetch today's visits");
  }

  return data || [];
}
