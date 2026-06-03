import {supabase} from "./supabase";
import {PAGE_SIZE} from "@/utils/constants";

export async function getClinicPatients({clinicId, query, page}) {
  let queryBuilder = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .eq("clinic_id", clinicId)
    .eq("is_active", true);

  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,phone.ilike.%${query}%`,
    );
  }

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    queryBuilder = queryBuilder.range(from, to);
  }

  queryBuilder = queryBuilder.order("created_at", { ascending: false });

  const {data, count, error} = await queryBuilder;

  if (error) {
    if (error.code === "PGRST103") {
      let countBuilder = supabase
        .from("patients")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .eq("is_active", true);

      if (query) {
        countBuilder = countBuilder.or(
          `name.ilike.%${query}%,phone.ilike.%${query}%`,
        );
      }

      const { count: totalCount } = await countBuilder;
      return { data: [], count: totalCount || 0 };
    }

    console.error(error);
    throw new Error("Failed to load patients data");
  }

  return {data, count};
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
  const {data, error} = await supabase
    .from("patients")
    .update({is_active: false})
    .eq("id", id);

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
