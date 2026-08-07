import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/ownUI/TableSkeleton";
import {TextState} from "@/components/ownUI/TextState";
import useTodayAppointments from "./useTodayAppointments";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiCalendarCheckLine,
  RiStethoscopeLine,
  RiPhoneLine,
  RiTimeLine,
  RiAlertLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
} from "@remixicon/react";
import {useState} from "react";
import CreateVisitDrawer from "./CreateVisitDrawer";

function TodayAppointmentsTable() {
  const {t} = useAppTranslation("visits");
  const {appointments, isLoading, isError, error} = useTodayAppointments();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  if (isError) {
    return (
      <TextState
        title={t("toasts.createError")}
        description={error?.message || "Failed to load today's appointments"}
        icon={RiAlertLine}
      />
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <TextState
        title={t("history.noHistory")}
        description="لا توجد حجوزات مسجلة لليوم حتى الآن"
        icon={RiCalendarCheckLine}
      />
    );
  }

  function handleStartVisit(appointment) {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(true);
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="w-full text-start border-collapse">
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="text-start font-bold text-foreground/80 py-3 ps-4 w-12">
                  {t("table.columns.serial")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.patientName")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.phone")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.visitType")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.status")}
                </TableHead>
                <TableHead className="text-end font-bold text-foreground/80 py-3 pe-4">
                  {t("table.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, index) => {
                const isCompleted = appointment.status === "completed";
                const isCancelled = appointment.status === "cancelled";

                return (
                  <TableRow
                    key={appointment.id || index}
                    className="border-b border-border/25 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.04]">
                    {/* Serial Number */}
                    <TableCell className="py-3 ps-4 font-mono font-bold text-xs text-muted-foreground">
                      <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted/60">
                        {appointment.serial_number || index + 1}
                      </span>
                    </TableCell>

                    {/* Patient Name */}
                    <TableCell className="py-3 font-semibold text-foreground/90">
                      <span>{appointment.name || appointment.patient_name || "—"}</span>
                    </TableCell>

                    {/* Phone Number */}
                    <TableCell className="py-3 font-mono text-xs">
                      <span
                        dir="ltr"
                        className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                        <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                        {appointment.phone || appointment.patient_phone || "—"}
                      </span>
                    </TableCell>

                    {/* Visit Type */}
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className={`font-medium text-[11px] px-2.5 py-0.5 rounded-full border ${
                          appointment.type === "follow_up"
                            ? "bg-amber-500/10 border-amber-200/50 text-amber-600 dark:text-amber-400"
                            : "bg-blue-500/10 border-blue-200/50 text-blue-600 dark:text-blue-400"
                        }`}>
                        {appointment.type === "follow_up"
                          ? t("modal.fields.followUp")
                          : t("modal.fields.checkup")}
                      </Badge>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-full gap-1 ${
                          isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            : isCancelled
                              ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                              : "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
                        }`}>
                        {isCompleted ? (
                          <RiCheckDoubleLine className="size-3" />
                        ) : isCancelled ? (
                          <RiCloseCircleLine className="size-3" />
                        ) : (
                          <RiTimeLine className="size-3" />
                        )}
                        <span>
                          {isCompleted
                            ? t("table.status.completed")
                            : isCancelled
                              ? t("table.status.cancelled")
                              : t("table.status.pending")}
                        </span>
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 pe-4 text-end">
                      <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        onClick={() => handleStartVisit(appointment)}
                        className={`h-8 gap-1.5 text-xs font-semibold ${
                          !isCompleted
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "text-muted-foreground"
                        }`}>
                        <RiStethoscopeLine className="size-3.5" />
                        <span>
                          {isCompleted
                            ? t("buttons.editVisit")
                            : t("buttons.startExamination")}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateVisitDrawer
        defaultPatient={selectedAppointment}
        appointmentId={selectedAppointment?.id}
        isOpen={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) setSelectedAppointment(null);
        }}
        showTrigger={false}
      />
    </>
  );
}

export default TodayAppointmentsTable;
