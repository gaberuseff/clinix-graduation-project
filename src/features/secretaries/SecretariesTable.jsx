import EmptyState from "@/components/ownUI/EmptyState";
import TableSkeleton from "@/components/ownUI/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import ConfirmDeleteModal from "@/components/ownUI/ConfirmDeleteModal";
import useSecretaries from "./useSecretaries";
import {useUpdateSecretary} from "./useUpdateSecretary";
import {useState} from "react";
import {
  RiPhoneLine,
  RiMailLine,
  RiUser3Line,
  RiAlertLine,
  RiMoreLine,
  RiDeleteBinLine,
  RiForbidLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";

function SecretariesTable() {
  const {secretaries, isLoadingSecretaries, isError, error} = useSecretaries();
  const {updateSecretary, isUpdating} = useUpdateSecretary();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [secretaryToDelete, setSecretaryToDelete] = useState(null);

  if (isLoadingSecretaries) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to Load Secretaries"
        description={
          error?.message ||
          "Something went wrong while fetching secretary records."
        }
        icon={RiAlertLine}
      />
    );
  }

  if (!secretaries || secretaries.length === 0) {
    return (
      <EmptyState
        title="No Secretaries Registered"
        description="No registered secretaries found for this clinic at the moment."
        icon={RiUser3Line}
      />
    );
  }

  function handleToggleBlock(secretary) {
    const action = secretary.is_blocked ? "unblock" : "block";
    updateSecretary({userId: secretary.id, action});
  }

  function handleDeleteClick(secretary) {
    setSecretaryToDelete(secretary);
    setIsDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!secretaryToDelete) return;
    updateSecretary(
      {userId: secretaryToDelete.id, action: "delete"},
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSecretaryToDelete(null);
        },
      }
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border">
        <div className="overflow-x-auto w-full">
          <Table dir="ltr" className="w-full text-left border-collapse">
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border/40 hover:bg-transparent">
                <TableHead className="text-left font-bold text-foreground/80 py-4 pl-6">
                  Full Name
                </TableHead>
                <TableHead className="text-left font-bold text-foreground/80 py-4">
                  Email Address
                </TableHead>
                <TableHead className="text-left font-bold text-foreground/80 py-4">
                  Phone Number
                </TableHead>
                <TableHead className="text-left font-bold text-foreground/80 py-4">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold text-foreground/80 py-4 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {secretaries.map((secretary) => (
                <TableRow
                  key={secretary.id}
                  className="border-b border-border/25">
                  <TableCell className="py-4 pl-6 font-semibold text-foreground/90 font-sans">
                    <div className="flex items-center gap-2.5">
                      <span className="capitalize">{secretary.full_name || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-muted-foreground font-medium font-sans">
                    <div className="flex items-center gap-1.5">
                      <RiMailLine className="size-4 text-muted-foreground/60" />
                      <span>{secretary.email || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
                      <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                      {secretary.phone || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={`font-semibold text-xs px-3 py-1 rounded-lg border ${
                        secretary.is_blocked
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                      }`}>
                      {secretary.is_blocked ? "Blocked" : "Active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isUpdating}
                          className="h-8 w-8">
                          <RiMoreLine className="size-4 text-muted-foreground" />
                          <span className="sr-only">Open Actions Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          disabled={isUpdating}
                          onClick={() => handleToggleBlock(secretary)}
                          className="gap-2">
                          {secretary.is_blocked ? (
                            <>
                              <RiCheckboxCircleLine className="size-4 text-muted-foreground" />
                              <span>Unblock</span>
                            </>
                          ) : (
                            <>
                              <RiForbidLine className="size-4 text-muted-foreground" />
                              <span>Block</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isUpdating}
                          onClick={() => handleDeleteClick(secretary)}
                          variant="destructive"
                          className="gap-2 text-destructive">
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

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSecretaryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={secretaryToDelete?.full_name}
        title="Delete Secretary"
        description="Are you sure you want to delete this secretary account? This action is permanent and will remove them from Supabase Auth and the database."
        isDeleting={isUpdating}
      />
    </>
  );
}

export default SecretariesTable;
