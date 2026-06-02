import EmptyState from "@/components/ownUI/EmptyState";
import TableSkeleton from "@/components/ownUI/TableSkeleton";
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
import CreatePatientDrawer from "./CreatePatientDrawer";
import ConfirmDeleteModal from "@/components/ownUI/ConfirmDeleteModal";
import {useState} from "react";
import {
  RiCalendarEventLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiMoreLine,
  RiPhoneLine,
  RiUser3Line,
  RiAlertLine,
} from "@remixicon/react";

function PatientsTable() {
  const {patients, isLoadingPatients, isError, error} = usePatients();
  const {deletePatientMutation, isDeletingPatient} = useDeletePatient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  if (isLoadingPatients) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to Load Patients"
        description={
          error?.message ||
          "Something went wrong while fetching patient records."
        }
        icon={RiAlertLine}
      />
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <EmptyState
        title="No Patients Registered"
        description="No registered patients found for this clinic at the moment."
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
          <Table dir="ltr" className="w-full text-left border-collapse">
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="text-left font-bold text-foreground/80 py-4 pl-6">
                  Patient Name
                </TableHead>
                <TableHead className="text-left font-bold text-foreground/80 py-4">
                  Birth Year
                </TableHead>
                <TableHead className="text-left font-bold text-foreground/80 py-4">
                  Phone Number
                </TableHead>
                <TableHead className="text-left font-bold text-foreground/80 py-4">
                  Gender
                </TableHead>
                <TableHead className="text-right font-bold text-foreground/80 py-4 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="border-b border-border/25">
                  <TableCell className="py-4 pl-6 font-semibold text-foreground/90 font-sans ">
                    <div className="flex items-center gap-2.5">
                      <span className="capitalize">{patient.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-muted-foreground font-medium font-sans">
                    <div className="flex items-center gap-1.5">
                      <RiCalendarEventLine className="size-4 text-muted-foreground/60" />
                      <span>{patient.birth_year || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
                      <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                      {patient.phone || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
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

                  <TableCell className="py-4 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl cursor-pointer hover:bg-muted/80">
                          <RiMoreLine className="size-4 text-muted-foreground" />
                          <span className="sr-only">Open Actions Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() => handleEdit(patient)}
                          className="cursor-pointer gap-2">
                          <RiEdit2Line className="size-4 text-muted-foreground" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(patient)}
                          disabled={isDeletingPatient}
                          variant="destructive"
                          className="cursor-pointer gap-2 text-destructive">
                          <RiDeleteBinLine className="size-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <CreatePatientDrawer
        patientToEdit={patientToEdit}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
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
        title="Delete Patient"
        description="Are you sure you want to delete this patient record?"
        isDeleting={isDeletingPatient}
      />
    </>
  );
}

export default PatientsTable;
