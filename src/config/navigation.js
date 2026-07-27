// src/config/navigation.js
import {
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Stethoscope,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"; // استعمل أي مكتبة أيقونات تحبها

// روابط سايد بار الطبيب
export const doctorNavLinks = [
  {
    title: "الرئيسية",
    titleKey: "dashboard",
    path: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "الكشوفات",
    titleKey: "visits",
    path: "/doctor/visits",
    icon: Stethoscope,
  },
  {
    title: "سجلات المرضى",
    titleKey: "patients",
    path: "/doctor/patients",
    icon: Users,
  },

  {
    title: "أرشيف الروشتات",
    titleKey: "prescriptions",
    path: "/doctor/prescriptions",
    icon: FileText,
  },
  {
    title: "المالية والتقارير",
    titleKey: "finance",
    path: "/doctor/finance",
    icon: Wallet,
  },
  {
    title: "السكرتارية",
    titleKey: "secretary",
    path: "/doctor/secretary",
    icon: UserPlus,
  },
  {
    title: "الإعدادات",
    titleKey: "settings",
    path: "/doctor/settings",
    icon: Settings,
  },
];

// روابط سايد بار السكرتير
export const receptionistNavLinks = [
  {
    title: "الرئيسية",
    titleKey: "dashboard",
    path: "/secretary/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "المواعيد",
    titleKey: "appointments",
    path: "/secretary/appointments",
    icon: UserPlus,
  },
  {
    title: "قائمة المرضى",
    titleKey: "patients",
    path: "/secretary/patients",
    icon: Users,
  },
  {
    title: "الخزينة والمدفوعات",
    titleKey: "payments",
    path: "/secretary/payments",
    icon: CreditCard,
  },
];
