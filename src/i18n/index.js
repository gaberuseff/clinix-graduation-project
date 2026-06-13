import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import patientsEn from "./en/patients.json";
import patientsAr from "./ar/patients.json";
import preferencesEn from "./en/preferences.json";
import preferencesAr from "./ar/preferences.json";
import dashboardEn from "./en/dashboard.json";
import dashboardAr from "./ar/dashboard.json";

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
    },

    ar: {
      patients: patientsAr,
      preferences: preferencesAr,
      dashboard: dashboardAr,
    },
  },

  lng: savedLanguage,

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
