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
const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in ms

export async function getClinicSettingsCached(clinicId) {
  if (!clinicId) return null;
  const cacheKey = `${CACHE_KEY_PREFIX}${clinicId}`;

  try {
    const cached = await get(cacheKey);
    const now = Date.now();

    // If online, check cache freshness (2 hours)
    if (navigator.onLine) {
      if (cached && (now - cached.timestamp < TWO_HOURS)) {
        return cached.settings;
      }

      const settings = await getClinicSettings(clinicId);
      if (settings) {
        await set(cacheKey, {
          settings,
          timestamp: now,
        });
        return settings;
      }
    }

    // If offline or fetch failed, return cached (even if expired)
    return cached ? cached.settings : null;
  } catch (error) {
    console.error("Error in getClinicSettingsCached:", error);
    if (navigator.onLine) {
      return await getClinicSettings(clinicId);
    }
    return null;
  }
}

