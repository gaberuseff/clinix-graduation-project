import {supabase} from "./supabase";

export async function createSecretary(secretaryData, clinicId) {
  const {data, error} = await supabase.functions.invoke("manage-secretaries", {
    body: {action: "create", ...secretaryData, clinic_id: clinicId},
  });

  if (error) throw error;

  return data;
}

export async function getSecretaries(clinicId) {
  const {data, error} = await supabase
    .from("users")
    .select("id, full_name, email, phone, is_blocked")
    .eq("clinic_id", clinicId)
    .eq("role", "secretary");

  if (error) throw error;

  return data;
}

export async function updateSecretaryAction(userId, action) {
  const {data, error} = await supabase.functions.invoke("manage-secretaries", {
    body: {userId, action},
  });

  if (error) throw error;

  return data;
}
