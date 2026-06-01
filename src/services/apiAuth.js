import {supabase} from "./supabase";

export async function loginUser({email, password}) {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loginUserWithPasskey() {
  const {data, error} = await supabase.auth.signInWithPasskey();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function registerPasskey() {
  const {data, error} = await supabase.auth.registerPasskey();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const {
    data: {session},
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return session?.user ?? null;
}

export async function registerUser({
  email,
  password,
  fullName,
  phone,
  clinicName,
  clinicAddress,
  clinicSpecialty,
}) {
  const clinicId = crypto.randomUUID();

  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        clinic_id: clinicId,
        full_name: fullName,
        phone,
        role: "doctor",
        clinic_name: clinicName,
        clinic_address: clinicAddress,
        clinic_specialty: clinicSpecialty,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logoutUser() {
  const {error} = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
