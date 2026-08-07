import {useState} from "react";
import useSecretaryDashboardStats from "./useSecretaryDashboardStats";
import useUpdateAppointmentStatus from "@/features/appointments/useUpdateAppointmentStatus";
import useClinicSettingsCached from "@/features/settings/useClinicSettingsCached";
import CreateAppointmentDrawer from "@/features/appointments/CreateAppointmentDrawer";
import CreatePatientDrawer from "@/features/patients/CreatePatientDrawer";
import {useAppTranslation} from "@/i18n/use-app-translation";
import PageHeader from "@/components/ownUI/PageHeader";
import {
  RiBookmarkLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiExchangeDollarLine,
  RiTimeLine,
  RiDashboard3Line,
  RiSearchLine,
  RiPhoneLine,
  RiUser3Line,
  RiCalendarEventLine,
  RiFlashlightLine,
} from "@remixicon/react";
import {formatCurrency, formatDate} from "@/utils/helpers";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Link} from "react-router-dom";
import {PATHS} from "@/config/paths";

function SecretaryDashboardLayout() {
  const {t, i18n} = useAppTranslation("dashboard");
  const {t: tAppt} = useAppTranslation("appointments");
  const {t: tPatient} = useAppTranslation("patients");
  
  const {stats, isLoading, error} = useSecretaryDashboardStats();
  const {updateStatus, isUpdating} = useUpdateAppointmentStatus();
  const {settings} = useClinicSettingsCached();
  
  const [searchQuery, setSearchQuery] = useState("");

  const currency = settings?.price_currency || "EGP";
  const isRtl = i18n.language === "ar";

  if (isLoading) {
    return (
      <div className="h-[450px] w-full flex items-center justify-center">
        <Spinner className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive font-semibold">
        {error.message || "Failed to load dashboard statistics"}
      </div>
    );
  }

  const {
    today_total_bookings = 0,
    today_pending_bookings = 0,
    today_completed_bookings = 0,
    today_cancelled_bookings = 0,
    today_revenue = 0,
    total_patients = 0,
    today_appointments = [],
    recent_patients = [],
  } = stats || {};

  const statCards = [
    {
      title: t("stats.todayTotal"),
      value: today_total_bookings,
      icon: RiBookmarkLine,
      colorClass: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: t("stats.todayPending"),
      value: today_pending_bookings,
      icon: RiTimeLine,
      colorClass:
        "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: t("stats.todayCompleted"),
      value: today_completed_bookings,
      icon: RiCheckDoubleLine,
      colorClass:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: t("stats.todayRevenue"),
      value: formatCurrency(today_revenue, currency),
      icon: RiExchangeDollarLine,
      colorClass:
        "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      isCurrency: true,
    },
    {
      title: t("stats.totalPatients"),
      value: total_patients,
      icon: RiUser3Line,
      colorClass:
        "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  // Helper to format time-only in local locale
  const formatTimeOnly = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredAppointments = today_appointments.filter((appt) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      appt.name.toLowerCase().includes(query) ||
      (appt.phone && String(appt.phone).includes(query))
    );
  });

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5 border-border/40">
        <PageHeader
          icon={RiDashboard3Line}
          title={t("nav.dashboard")}
          description={isRtl ? "متابعة الحجوزات اليومية وإدارة شؤون المرضى الحالية" : "Track daily bookings and manage active patient affairs"}
        />
        <div className="text-sm font-semibold text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border/20 self-start sm:self-auto shrink-0 flex items-center gap-2">
          <RiCalendarEventLine className="size-4 text-primary" />
          <span>
            {new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-EG" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-5 bg-card border border-border/50 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 ring-1 ring-border/5 group">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">
                  {card.title}
                </span>
                <span
                  className={`text-xl font-bold tracking-tight block group-hover:scale-102 transition-transform duration-200 ${
                    card.isCurrency ? "font-sans text-lg md:text-xl" : "font-mono text-2xl"
                  }`}>
                  {card.value}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${card.colorClass} shrink-0 group-hover:rotate-6 transition-transform duration-200`}>
                <Icon className="size-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        
        {/* Left Section: Today's Appointments (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs space-y-4">
            
            {/* Appointments Title and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-border/40">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <RiCalendarEventLine className="size-5 text-primary" />
                  <span>{t("secretaryDashboard.todayAppointments")}</span>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    {today_appointments.length}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isRtl
                    ? "قائمة بالمرضى الذين لديهم مواعيد مسجلة لهذا اليوم"
                    : "List of patients with bookings scheduled for today"}
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:max-w-xs">
                <RiSearchLine className={`absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground ${isRtl ? "right-3" : "left-3"}`} />
                <Input
                  type="text"
                  placeholder={tAppt("headers.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`h-9 w-full ${isRtl ? "pr-9 text-right" : "pl-9 text-left"}`}
                />
              </div>
            </div>

            {/* Appointments Table / List */}
            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="inline-flex p-3 bg-muted/40 rounded-full border border-border/10 text-muted-foreground">
                  <RiCalendarEventLine className="size-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    {searchQuery ? (isRtl ? "لم يتم العثور على نتائج" : "No results found") : t("secretaryDashboard.noAppointments")}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? (isRtl ? "تأكد من كتابة الاسم أو رقم الهاتف بشكل صحيح" : "Double-check the search keyword and try again")
                      : (isRtl ? "اضغط على زر إضافة حجز جديد لحجز موعد لزيارة اليوم" : "Click 'Book Appointment' to schedule a patient for today")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground font-medium">
                      <th className={`pb-3.5 font-bold ${isRtl ? "text-right" : "text-left"}`}>
                        {tAppt("table.columns.name")}
                      </th>
                      <th className={`pb-3.5 font-bold hidden sm:table-cell ${isRtl ? "text-right" : "text-left"}`}>
                        {tAppt("table.columns.phone")}
                      </th>
                      <th className={`pb-3.5 font-bold ${isRtl ? "text-right" : "text-left"}`}>
                        {tAppt("table.columns.type")}
                      </th>
                      <th className={`pb-3.5 font-bold hidden md:table-cell ${isRtl ? "text-right" : "text-left"}`}>
                        {tAppt("table.columns.price")}
                      </th>
                      <th className={`pb-3.5 font-bold ${isRtl ? "text-right" : "text-left"}`}>
                        {tAppt("table.columns.date")}
                      </th>
                      <th className={`pb-3.5 font-bold ${isRtl ? "text-right" : "text-left"}`}>
                        {tAppt("table.columns.status")}
                      </th>
                      <th className={`pb-3.5 font-bold text-center`}>
                        {tAppt("table.columns.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredAppointments.map((appt) => {
                      const isPending = appt.status === "pending";
                      const isCompleted = appt.status === "completed";
                      const isCancelled = appt.status === "cancelled";

                      return (
                        <tr
                          key={appt.id}
                          className="hover:bg-muted/10 transition-colors group">
                          <td className="py-3 font-semibold text-foreground">
                            {appt.name}
                          </td>
                          <td className="py-3 text-muted-foreground hidden sm:table-cell">
                            {appt.phone ? (
                              <a
                                href={`tel:${appt.phone}`}
                                className="flex items-center gap-1 hover:text-primary transition-colors font-mono">
                                <RiPhoneLine className="size-3.5" />
                                <span>{appt.phone}</span>
                              </a>
                            ) : (
                              "..."
                            )}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                                appt.type === "checkup"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10"
                                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10"
                              }`}>
                              {appt.type === "checkup"
                                ? tAppt("modal.add.placeholders.checkup")
                                : tAppt("modal.add.placeholders.followup")}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-foreground font-mono hidden md:table-cell">
                            {formatCurrency(appt.price, currency)}
                          </td>
                          <td className="py-3 text-muted-foreground font-semibold font-mono">
                            {formatTimeOnly(appt.date)}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                                isPending
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : isCompleted
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                              }`}>
                              <span
                                className={`size-1.5 rounded-full ${
                                  isPending
                                    ? "bg-amber-500"
                                    : isCompleted
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />
                              <span>
                                {tAppt(`table.status.${appt.status}`)}
                              </span>
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              {isPending ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      updateStatus({id: appt.id, status: "completed"})
                                    }
                                    disabled={isUpdating}
                                    className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10 rounded-lg cursor-pointer transition-colors"
                                    title={tAppt("buttons.complete")}>
                                    <RiCheckDoubleLine className="size-4.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      updateStatus({id: appt.id, status: "cancelled"})
                                    }
                                    disabled={isUpdating}
                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                    title={tAppt("buttons.cancel")}>
                                    <RiCloseCircleLine className="size-4.5" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground italic select-none">
                                  {isRtl ? "تمت معالجته" : "Processed"}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Quick Actions & Recent Patients */}
        <div className="space-y-6.5">
          
          {/* Quick Actions Card */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 border-b pb-3 border-border/40">
              <RiFlashlightLine className="size-5 text-primary" />
              <span>{t("secretaryDashboard.quickActions")}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {/* Add Booking trigger drawer */}
              <CreateAppointmentDrawer />
              
              {/* Add Patient trigger drawer */}
              <CreatePatientDrawer />
            </div>
          </div>

          {/* Recent Patients Card */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-border/40">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <RiUser3Line className="size-5 text-primary" />
                <span>{t("secretaryDashboard.recentPatients")}</span>
              </h3>
              <Link
                to={PATHS.secretary.patients}
                className="text-xs text-primary hover:underline font-semibold">
                {isRtl ? "عرض الكل" : "View all"}
              </Link>
            </div>

            {recent_patients.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs">
                {t("secretaryDashboard.noRecentPatients")}
              </div>
            ) : (
              <div className="space-y-3.5">
                {recent_patients.map((pat) => (
                  <div
                    key={pat.id}
                    className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/10 rounded-xl hover:bg-muted/40 transition-colors duration-200">
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-foreground block">
                        {pat.name}
                      </span>
                      {pat.phone && (
                        <span className="text-xs font-semibold text-muted-foreground font-mono flex items-center gap-1">
                          <RiPhoneLine className="size-3" />
                          <span>{pat.phone}</span>
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[10px] bg-card text-muted-foreground px-2 py-1 rounded-lg border border-border/20 font-semibold shrink-0">
                      {formatDate(pat.created_at, i18n.language === "ar" ? "ar-EG" : "en-US").split(",")[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default SecretaryDashboardLayout;
