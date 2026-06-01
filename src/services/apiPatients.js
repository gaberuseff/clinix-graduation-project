import {supabase} from "./supabase";

export async function getClinicPatients({clinicId, query}) {
  let queryBuilder = supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinicId);

  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,phone.ilike.%${query}%`,
    );
  }

  const {data, error} = await queryBuilder;

  if (error) {
    console.error(error);
    throw new Error("Failed to load patients data");
  }

  return data;
}

export async function createPatient(newPatient) {
  const {data, error} = await supabase
    .from("patients")
    .insert([newPatient])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create new patient");
  }

  return data;
}

export async function deletePatient({id}) {
  const {data, error} = await supabase.from("patients").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete patient");
  }

  return data;
}

export async function updatePatient({id, updatedFields}) {
  const {data, error} = await supabase
    .from("patients")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update patient data");
  }

  return data;
}
