import {supabase} from "./supabase";

export async function getClinicSettings(clinicId) {
  const {data, error} = await supabase
    .from("clinic_settings")
    .select("*")
    .eq("clinic_id", clinicId);

  if (error) {
    console.error("Supabase settings query error:", error);
    throw new Error(error.message || "Could not get settings");
  }

  // Return the first item or null if it doesn't exist yet
  return data && data.length > 0 ? data[0] : null;
}

export async function updateClinicSettings({clinicId, updatedFields}) {
  const {data, error} = await supabase
    .from("clinic_settings")
    .upsert({clinic_id: clinicId, ...updatedFields})
    .select()
    .single();

  if (error) {
    console.error("Supabase settings update error:", error);
    throw new Error(error.message || "Could not update settings");
  }

  return data;
}
