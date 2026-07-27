// src/config/navigation.js
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Stethoscope,
  UserPlus,
  Users,
  Wallet
} from "lucide-react"; // استعمل أي مكتبة أيقونات تحبها
import {PATHS} from "./paths";

// روابط سايد بار الطبيب
export const doctorNavLinks = [
  {
    title: "الرئيسية",
    titleKey: "dashboard",
    path: PATHS.doctor.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "الكشوفات",
    titleKey: "visits",
    path: PATHS.doctor.visits,
    icon: Stethoscope,
  },
  {
    title: "سجلات المرضى",
    titleKey: "patients",
    path: PATHS.doctor.patients,
    icon: Users,
  },

  {
    title: "أرشيف الروشتات",
    titleKey: "prescriptions",
    path: PATHS.doctor.prescriptions,
    icon: FileText,
  },
  {
    title: "المالية والتقارير",
    titleKey: "finance",
    path: PATHS.doctor.finance,
    icon: Wallet,
  },
  {
    title: "السكرتارية",
    titleKey: "secretary",
    path: PATHS.doctor.secretary,
    icon: UserPlus,
  },
  {
    title: "الإعدادات",
    titleKey: "settings",
    path: PATHS.doctor.settings,
    icon: Settings,
  },
];

// روابط سايد بار السكرتير
export const receptionistNavLinks = [
  {
    title: "الرئيسية",
    titleKey: "dashboard",
    path: PATHS.secretary.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "المواعيد",
    titleKey: "appointments",
    path: PATHS.secretary.appointments,
    icon: UserPlus,
  },
  {
    title: "قائمة المرضى",
    titleKey: "patients",
    path: PATHS.secretary.patients,
    icon: Users,
  },
  {
    title: "الخزينة والمدفوعات",
    titleKey: "payments",
    path: PATHS.secretary.payments,
    icon: CreditCard,
  },
];
