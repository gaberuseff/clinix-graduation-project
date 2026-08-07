import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import patientsEn from "./en/patients.json";
import patientsAr from "./ar/patients.json";
import preferencesEn from "./en/preferences.json";
import preferencesAr from "./ar/preferences.json";
import dashboardEn from "./en/dashboard.json";
import dashboardAr from "./ar/dashboard.json";
import appointmentsEn from "./en/appointments.json";
import appointmentsAr from "./ar/appointments.json";
import secretariesEn from "./en/secretaries.json";
import secretariesAr from "./ar/secretaries.json";
import settingsEn from "./en/settings.json";
import settingsAr from "./ar/settings.json";
import visitsEn from "./en/visits.json";
import visitsAr from "./ar/visits.json";
import financeEn from "./en/finance.json";
import financeAr from "./ar/finance.json";

const savedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("language") || "en"
    : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      patients: patientsEn,
      preferences: preferencesEn,
      dashboard: dashboardEn,
      appointments: appointmentsEn,
      secretaries: secretariesEn,
      settings: settingsEn,
      visits: visitsEn,
      finance: financeEn,
    },

    ar: {
      patients: patientsAr,
      preferences: preferencesAr,
      dashboard: dashboardAr,
      appointments: appointmentsAr,
      secretaries: secretariesAr,
      settings: settingsAr,
      visits: visitsAr,
      finance: financeAr,
    },
  },

  lng: savedLanguage,

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
