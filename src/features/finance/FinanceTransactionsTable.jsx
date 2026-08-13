import {Badge} from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {RiPhoneLine, RiFileListLine, RiCheckDoubleLine, RiCloseCircleLine, RiTimeLine} from "@remixicon/react";
import {TextState} from "@/components/ownUI/TextState";
import {formatCurrency} from "@/utils/helpers";

function FinanceTransactionsTable({transactions = [], currency}) {
  const {t} = useAppTranslation(["finance", "visits"]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="border border-border/50 rounded-2xl bg-card p-6">
        <TextState
          title={t("finance:transactions.noTransactions")}
          description="حاول تعديل نطاق فلترة التواريخ لعرض الحركات المالية للحجوزات."
          icon={RiFileListLine}
        />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs">
      <div className="p-4 border-b border-border/40 bg-muted/20">
        <h3 className="text-sm font-bold text-foreground">
          {t("finance:transactions.title")}
        </h3>
      </div>
      <div className="overflow-x-auto w-full">
        <Table className="w-full text-start border-collapse">
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="text-start font-bold text-foreground/80 py-3 ps-4">
                {t("finance:transactions.patientName")}
              </TableHead>
              <TableHead className="text-start font-bold text-foreground/80 py-3">
                {t("finance:transactions.phone")}
              </TableHead>
              <TableHead className="text-start font-bold text-foreground/80 py-3">
                {t("finance:transactions.date")}
              </TableHead>
              <TableHead className="text-start font-bold text-foreground/80 py-3">
                {t("finance:transactions.type")}
              </TableHead>
              <TableHead className="text-start font-bold text-foreground/80 py-3">
                {t("finance:transactions.status")}
              </TableHead>
              <TableHead className="text-end font-bold text-foreground/80 py-3 pe-4">
                {t("finance:transactions.fee")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => {
              const isCompleted = tx.status === "completed";
              const isCancelled = tx.status === "cancelled";

              return (
                <TableRow
                  key={tx.id || index}
                  className="border-b border-border/25 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.04]">
                  {/* Patient Name */}
                  <TableCell className="py-3 ps-4 font-semibold text-foreground/90">
                    {tx.patient_name}
                  </TableCell>

                  {/* Phone Number */}
                  <TableCell className="py-3 font-mono text-xs">
                    <span
                      dir="ltr"
                      className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                      <RiPhoneLine className="size-3.5 text-muted-foreground/60" />
                      {tx.patient_phone}
                    </span>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                    {new Date(tx.date).toLocaleDateString("ar-EG", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>

                  {/* Visit Type */}
                  <TableCell className="py-3">
                    <Badge
                      variant="secondary"
                      className={`font-medium text-[11px] px-2 rounded-full border ${
                        tx.visit_type === "follow_up"
                          ? "bg-amber-500/10 border-amber-200/50 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/10 border-blue-200/50 text-blue-600 dark:text-blue-400"
                      }`}>
                      {tx.visit_type === "follow_up"
                        ? t("visits:modal.fields.followUp")
                        : t("visits:modal.fields.checkup")}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={`font-semibold text-[10px] px-2 py-0.5 rounded-full gap-1 ${
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
                          ? t("visits:table.status.completed")
                          : isCancelled
                            ? t("visits:table.status.cancelled")
                            : t("visits:table.status.pending")}
                      </span>
                    </Badge>
                  </TableCell>

                  {/* Fee */}
                  <TableCell className="py-3 pe-4 text-end font-bold text-foreground/90">
                    {formatCurrency(tx.price, currency)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default FinanceTransactionsTable;
