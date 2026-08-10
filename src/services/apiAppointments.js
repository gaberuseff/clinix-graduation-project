import {supabase} from "./supabase";
import {PAGE_SIZE} from "@/utils/constants";

export async function getClinicAppointments({clinicId, query, page, status, dateFilter}) {
  let queryBuilder = supabase
    .from("appointments")
    .select("*", {count: "exact"})
    .eq("clinic_id", clinicId);

  // Filter based on the chosen day (defaults to today)
  const filter = dateFilter || "today";

  if (filter !== "all") {
    const targetDate = new Date();
    if (filter === "tomorrow") {
      targetDate.setDate(targetDate.getDate() + 1);
    } else if (filter === "dayAfterTomorrow") {
      targetDate.setDate(targetDate.getDate() + 2);
    }

    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0).toISOString();
    const dayEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999).toISOString();

    queryBuilder = queryBuilder
      .gte("date", dayStart)
      .lte("date", dayEnd);
  }

  if (status && status !== "all") {
    queryBuilder = queryBuilder.eq("status", status);
  }

  if (query) {
    const cleanQuery = query.trim();
    if (/^\d+$/.test(cleanQuery)) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${cleanQuery}%,phone.eq.${Number(cleanQuery)}`,
      );
    } else {
      queryBuilder = queryBuilder.ilike("name", `%${cleanQuery}%`);
    }
  }

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    queryBuilder = queryBuilder.range(from, to);
  }

  // Order by date descending (nearest/newest bookings first)
  queryBuilder = queryBuilder.order("date", {ascending: false});

  const {data, count, error} = await queryBuilder;

  if (error) {
    console.error("Supabase getClinicAppointments error:", error);
    throw new Error(error.message || "Failed to load appointments data");
  }

  return {data, count};
}

export async function createAppointment(newAppointment) {
  const {data, error} = await supabase
    .from("appointments")
    .insert([newAppointment])
    .select()
    .single();

  if (error) {
    console.error("Supabase createAppointment error:", error);
    throw new Error(error.message || "Failed to create new appointment");
  }

  return data;
}

export async function updateAppointmentStatus({id, status}) {
  const {data, error} = await supabase
    .from("appointments")
    .update({status})
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateAppointmentStatus error:", error);
    throw new Error(error.message || "Failed to update appointment status");
  }

  return data;
}
