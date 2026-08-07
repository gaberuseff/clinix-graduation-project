import {Pagination} from "@/components/ownUI/Pagination";
import TableSkeleton from "@/components/ownUI/TableSkeleton";
import {TextState} from "@/components/ownUI/TextState";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAppointments from "./useAppointments";
import useUpdateAppointmentStatus from "./useUpdateAppointmentStatus";
import useClinicSettingsCached from "@/features/settings/useClinicSettingsCached";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiAlertLine,
  RiCalendarEventLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiMoreLine,
  RiPhoneLine,
  RiUser3Line,
  RiPriceTag3Line,
} from "@remixicon/react";
import {formatCurrency, formatDate} from "@/utils/helpers";

function AppointmentsTable() {
  const {appointments, count, isLoadingAppointments, isError, error} = useAppointments();
  const {updateStatus, isUpdating} = useUpdateAppointmentStatus();
  const {settings} = useClinicSettingsCached();
  const {t, i18n} = useAppTranslation("appointments");

  const currency = settings?.price_currency || "EGP";

  if (isLoadingAppointments) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  if (isError) {
    return (
      <TextState
        title={t("states.error.title")}
        description={error?.message || t("states.error.description")}
        icon={RiAlertLine}
      />
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <TextState
        title={t("states.empty.title")}
        description={t("states.empty.description")}
        icon={RiUser3Line}
      />
    );
  }

  const handleStatusChange = (id, status) => {
    updateStatus({id, status});
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="w-full text-start border-collapse">
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="text-start font-bold text-foreground/80 py-2.5 ps-4">
                  {t("table.columns.name")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.phone")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.type")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.price")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.date")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.status")}
                </TableHead>
                <TableHead className="text-end font-bold text-foreground/80 py-2.5 pe-4">
                  {t("table.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const apptDate = new Date(appt.date);
                const formattedDate = formatDate(apptDate, i18n.language === "ar" ? "ar-EG" : "en-US");

                return (
                  <TableRow
                    key={appt.id}
                    className="border-b border-border/25 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.04]">
                    {/* Patient Name */}
                    <TableCell className="py-2.5 ps-4 font-semibold text-foreground/90 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="capitalize">{appt.name}</span>
                      </div>
                    </TableCell>

                    {/* Patient Phone */}
                    <TableCell className="py-2.5">
                      <span
                        dir="ltr"
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
                        <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                        {appt.phone || "—"}
                      </span>
                    </TableCell>

                    {/* Visit Type */}
                    <TableCell className="py-2.5">
                      <Badge
                        variant="secondary"
                        className={`font-semibold text-[10px] tracking-wide px-2.5 py-0.5 rounded-full border select-none ${
                          appt.type === "checkup"
                            ? "bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400"
                            : "bg-blue-500/10 border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400"
                        }`}>
                        {appt.type === "checkup"
                          ? t("modal.add.placeholders.checkup")
                          : t("modal.add.placeholders.followup")}
                      </Badge>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="py-2.5 font-sans font-semibold text-foreground/80 text-sm">
                      <div className="flex items-center gap-1">
                        <RiPriceTag3Line className="size-3.5 text-muted-foreground/60" />
                        <span>{formatCurrency(appt.price, currency)}</span>
                      </div>
                    </TableCell>

                    {/* Appointment Date */}
                    <TableCell className="py-2.5 text-muted-foreground font-medium font-sans">
                      <div className="flex items-center gap-1.5">
                        <RiCalendarEventLine className="size-4 text-muted-foreground/60" />
                        <span className="text-xs">{formattedDate}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-2.5">
                      <Badge
                        variant="secondary"
                        className={`font-semibold text-xs px-2.5 py-0.5 rounded-full border select-none ${
                          appt.status === "completed"
                            ? "bg-green-500/10 border-green-200/50 text-green-600 dark:text-green-400"
                            : appt.status === "cancelled"
                            ? "bg-red-500/10 border-red-200/50 text-red-600 dark:text-red-400"
                            : "bg-amber-500/10 border-amber-200/50 text-amber-600 dark:text-amber-400"
                        }`}>
                        {t(`table.status.${appt.status || "pending"}`)}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-2.5 pe-4 text-end">
                      {appt.status === "pending" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isUpdating}
                              className="h-8 w-8 rounded-lg hover:bg-muted/80">
                              <RiMoreLine className="size-4 text-muted-foreground" />
                              <span className="sr-only">Open Actions Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appt.id, "completed")}
                              className="gap-2 text-green-600 dark:text-green-400">
                              <RiCheckDoubleLine className="size-4" />
                              <span>{t("buttons.complete")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appt.id, "cancelled")}
                              className="gap-2 text-destructive">
                              <RiCloseCircleLine className="size-4" />
                              <span>{t("buttons.cancel")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Pagination count={count} resourceName="appointments" />
      </div>
    </>
  );
}

export default AppointmentsTable;
