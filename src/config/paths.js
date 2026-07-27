// src/config/paths.js

export const PATH_SEGMENTS = {
  dashboard: "dashboard",
  patients: "patients",
  patientDetails: "patients/:patientId",
  secretary: "secretary",
  visits: "visits",
  finance: "finance",
  settings: "settings",
  preferences: "preferences",
  appointments: "appointments",
  payments: "payments",
  prescriptions: "prescriptions",
};

export const PATHS = {
  root: "/",
  login: "/login",
  register: "/register",

  doctor: {
    root: "/doctor",
    dashboard: `/doctor/${PATH_SEGMENTS.dashboard}`,
    patients: `/doctor/${PATH_SEGMENTS.patients}`,
    secretary: `/doctor/${PATH_SEGMENTS.secretary}`,
    patientDetails: (patientId = ":patientId") =>
      `/doctor/patients/${patientId}`,
    visits: `/doctor/${PATH_SEGMENTS.visits}`,
    finance: `/doctor/${PATH_SEGMENTS.finance}`,
    settings: `/doctor/${PATH_SEGMENTS.settings}`,
    preferences: `/doctor/${PATH_SEGMENTS.preferences}`,
    prescriptions: `/doctor/${PATH_SEGMENTS.prescriptions}`,
  },

  secretary: {
    root: "/secretary",
    dashboard: `/secretary/${PATH_SEGMENTS.dashboard}`,
    appointments: `/secretary/${PATH_SEGMENTS.appointments}`,
    patients: `/secretary/${PATH_SEGMENTS.patients}`,
    payments: `/secretary/${PATH_SEGMENTS.payments}`,
    preferences: `/secretary/${PATH_SEGMENTS.preferences}`,
  },
};
