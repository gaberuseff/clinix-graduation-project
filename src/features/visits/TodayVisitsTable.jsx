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
import useTodayVisits from "./useTodayVisits";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiPrinterLine,
  RiFileListLine,
  RiPhoneLine,
  RiAlertLine,
  RiEdit2Line,
} from "@remixicon/react";
import {printPrescription} from "@/utils/printPrescription";
import useUser from "@/features/auth/useUser";
import {useState} from "react";
import CreateVisitDrawer from "./CreateVisitDrawer";

function TodayVisitsTable() {
  const {t} = useAppTranslation("visits");
  const {visits, isLoading, isError, error} = useTodayVisits();
  const {user} = useUser();

  const [visitToEdit, setVisitToEdit] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return <TableSkeleton rows={4} columns={5} />;
  }

  if (isError) {
    return (
      <TextState
        title={t("toasts.createError")}
        description={error?.message || "Failed to load today's visits"}
        icon={RiAlertLine}
      />
    );
  }

  if (!visits || visits.length === 0) {
    return (
      <TextState
        title={t("table.visitsEmpty")}
        description={t("table.visitsEmptyDesc")}
        icon={RiFileListLine}
      />
    );
  }

  function handlePrint(visit) {
    printPrescription({
      clinicName: user?.user_metadata?.clinic_name || "العيادة الطبية",
      doctorName: user?.user_metadata?.full_name || "الطبيب المعالج",
      patientName: visit.patient_name,
      phone: visit.patient_phone,
      date: visit.created_at,
      diagnosis: visit.diagnosis,
      prescription: visit.prescription,
      doctorNotes: visit.doctor_notes,
    });
  }

  function handleEdit(visit) {
    setVisitToEdit(visit);
    setIsEditOpen(true);
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="w-full text-start border-collapse">
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="text-start font-bold text-foreground/80 py-3 ps-4">
                  {t("table.columns.patientName")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.phone")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.visitType")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-3">
                  {t("table.columns.diagnosis")}
                </TableHead>
                <TableHead className="text-end font-bold text-foreground/80 py-3 pe-4">
                  {t("table.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit, index) => (
                <TableRow
                  key={visit.id || index}
                  className="border-b border-border/25 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.04]">
                  {/* Patient Name */}
                  <TableCell className="py-3 ps-4 font-semibold text-foreground/90">
                    {visit.patient_name}
                  </TableCell>

                  {/* Phone Number */}
                  <TableCell className="py-3 font-mono text-xs">
                    <span
                      dir="ltr"
                      className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                      <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                      {visit.patient_phone}
                    </span>
                  </TableCell>

                  {/* Visit Type */}
                  <TableCell className="py-3">
                    <Badge
                      variant="secondary"
                      className={`font-medium text-[11px] px-2.5 py-0.5 rounded-full border ${
                        visit.visit_type === "follow_up"
                          ? "bg-amber-500/10 border-amber-200/50 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/10 border-blue-200/50 text-blue-600 dark:text-blue-400"
                      }`}>
                      {visit.visit_type === "follow_up"
                        ? t("modal.fields.followUp")
                        : t("modal.fields.checkup")}
                    </Badge>
                  </TableCell>

                  {/* Diagnosis */}
                  <TableCell className="py-3 text-sm text-foreground/85 max-w-[200px] truncate">
                    {visit.diagnosis || "—"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 pe-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrint(visit)}
                        className="h-8 gap-1.5 text-xs font-semibold border-emerald-600/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                        <RiPrinterLine className="size-3.5" />
                        <span>{t("table.printPrescription")}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(visit)}
                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                        <RiEdit2Line className="size-3.5" />
                        <span>{t("table.edit")}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateVisitDrawer
        visitToEdit={visitToEdit}
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setVisitToEdit(null);
        }}
        showTrigger={false}
      />
    </>
  );
}

export default TodayVisitsTable;
