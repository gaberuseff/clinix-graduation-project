import {get, set} from "idb-keyval";
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

  // Update local cache as well
  try {
    const cacheKey = `clinic_settings_cache_${clinicId}`;
    await set(cacheKey, {
      settings: data,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Failed to update clinic settings cache:", err);
  }

  return data;
}

const CACHE_KEY_PREFIX = "clinic_settings_cache_";

export async function getClinicSettingsCached(clinicId) {
  if (!clinicId) return null;
  const cacheKey = `${CACHE_KEY_PREFIX}${clinicId}`;

  try {
    const cached = await get(cacheKey);

    if (navigator.onLine) {
      try {
        const settings = await getClinicSettings(clinicId);
        if (settings) {
          await set(cacheKey, {
            settings,
            timestamp: Date.now(),
          });
          return settings;
        }
      } catch (err) {
        console.error("Failed to fetch fresh settings, falling back to cache:", err);
      }
    }

    // If offline or fetch failed, return cached
    return cached ? cached.settings : null;
  } catch (error) {
    console.error("Error in getClinicSettingsCached:", error);
    if (navigator.onLine) {
      try {
        return await getClinicSettings(clinicId);
      } catch (netErr) {
        console.error("Fallback network fetch also failed:", netErr);
      }
    }
    return null;
  }
}

