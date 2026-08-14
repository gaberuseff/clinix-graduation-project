import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qkrjqkujiuunuclmtyuf.supabase.co";
const supabaseKey = "sb_publishable_oRBiB-w7l5ViRr8Biwo1dw_osSS3Wyw";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: false })
    .limit(10);
  
  if (error) {
    console.error("Error fetching appointments:", error);
  } else {
    console.log("Appointments in DB:");
    data.forEach(app => {
      console.log(`ID: ${app.id}, Name: ${app.name}, Date: ${app.date}, Status: ${app.status}, ClinicID: ${app.clinic_id}`);
    });
  }
}

check();
