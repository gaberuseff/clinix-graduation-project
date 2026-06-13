import ConfirmDeleteModal from "@/components/ownUI/ConfirmDeleteModal";
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
import useDeletePatient from "@/features/patients/useDeletePatient";
import usePatients from "@/features/patients/usePatients";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiAlertLine,
  RiCalendarEventLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiMoreLine,
  RiPhoneLine,
  RiUser3Line,
} from "@remixicon/react";
import {useState} from "react";
import CreatePatientDrawer from "./CreatePatientDrawer";

function PatientsTable() {
  const {patients, count, isLoadingPatients, isError, error} = usePatients();
  const {deletePatientMutation, isDeletingPatient} = useDeletePatient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const {t} = useAppTranslation("patients");

  if (isLoadingPatients) {
    return <TableSkeleton rows={5} columns={5} />;
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

  if (!patients || patients.length === 0) {
    return (
      <TextState
        title={t("states.empty.title")}
        description={t("states.empty.description")}
        icon={RiUser3Line}
      />
    );
  }

  function handleDeleteClick(patient) {
    setPatientToDelete(patient);
    setIsDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!patientToDelete) return;
    deletePatientMutation(
      {id: patientToDelete.id},
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setPatientToDelete(null);
        },
      },
    );
  }

  function handleEdit(patient) {
    setPatientToEdit(patient);
    setIsEditOpen(true);
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border">
        <div className="overflow-x-auto w-full">
          <Table className="w-full text-start border-collapse">
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="text-start font-bold text-foreground/80 py-2.5 ps-4">
                  {t("table.columns.name")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.birth_year")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.phone")}
                </TableHead>
                <TableHead className="text-start font-bold text-foreground/80 py-2.5">
                  {t("table.columns.gender")}
                </TableHead>
                <TableHead className="text-end font-bold text-foreground/80 py-2.5 pe-4">
                  {t("table.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="border-b border-border/25">
                  <TableCell className="py-2.5 ps-4 font-semibold text-foreground/90 font-sans ">
                    <div className="flex items-center gap-2.5">
                      <span className="capitalize">{patient.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-2.5 text-muted-foreground font-medium font-sans">
                    <div className="flex items-center gap-1.5">
                      <RiCalendarEventLine className="size-4 text-muted-foreground/60" />
                      <span>{patient.birth_year || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-2.5">
                    <span
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
                      <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                      {patient.phone || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="py-2.5">
                    <Badge
                      variant="secondary"
                      className={`font-semibold text-xs px-3 py-1 rounded-lg border ${
                        patient.gender === "male"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                      }`}>
                      {patient.gender?.toUpperCase() || "—"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-2.5 pe-4 text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RiMoreLine className="size-4 text-muted-foreground" />
                          <span className="sr-only">Open Actions Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() => handleEdit(patient)}
                          className="gap-2">
                          <RiEdit2Line className="size-4 text-muted-foreground" />
                          <span>{t("buttons.edit")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(patient)}
                          disabled={isDeletingPatient}
                          variant="destructive"
                          className="gap-2 text-destructive">
                          <RiDeleteBinLine className="size-4" />
                          <span>{t("buttons.delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination count={count} resourceName="patients" />
      </div>
      <CreatePatientDrawer
        patientToEdit={patientToEdit}
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setPatientToEdit(null);
        }}
        showTrigger={false}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={patientToDelete?.name}
        title={t("buttons.delete")}
        description={t("modal.delete.desc")}
        isDeleting={isDeletingPatient}
      />
    </>
  );
}

export default PatientsTable;
