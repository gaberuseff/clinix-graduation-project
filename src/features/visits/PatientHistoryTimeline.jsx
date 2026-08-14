import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {TextState} from "@/components/ownUI/TextState";
import TableSkeleton from "@/components/ownUI/TableSkeleton";
import usePatientHistory from "./usePatientHistory";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiCalendarEventLine,
  RiCapsuleLine,
  RiFileTextLine,
  RiPhoneLine,
  RiStethoscopeLine,
  RiInformationLine,
  RiEdit2Line,
} from "@remixicon/react";
import {useState} from "react";
import CreateVisitDrawer from "./CreateVisitDrawer";

function PatientHistoryTimeline({phone}) {
  const {t} = useAppTranslation("visits");
  const {history = [], patientInfo, isLoading} = usePatientHistory(phone);

  const [visitToEdit, setVisitToEdit] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!phone || String(phone).trim().length === 0) {
    return (
      <TextState
        title={t("history.title")}
        description={t("history.searchPrompt")}
        icon={RiPhoneLine}
      />
    );
  }

  if (isLoading) {
    return <TableSkeleton rows={3} columns={3} />;
  }

  function handleEditVisit(visit) {
    setVisitToEdit(visit);
    setIsEditOpen(true);
  }

  return (
    <div className="space-y-6">
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
              {String(patientInfo?.name || phone || "").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {patientInfo?.name || t("history.noName")}
              </h3>
              <p dir="ltr" className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <RiPhoneLine className="size-3" />
                <span>{phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs px-3 py-1 font-medium gap-1 bg-background">
              <RiStethoscopeLine className="size-3.5 text-emerald-600" />
              <span>{t("history.totalVisits", {count: history.length})}</span>
            </Badge>
            {patientInfo?.gender && (
              <Badge variant="secondary" className="capitalize text-xs px-2.5 py-1">
                {patientInfo.gender}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {(!history || history.length === 0) ? (
        <TextState
          title={t("history.noHistory")}
          description={t("history.noHistory")}
          icon={RiInformationLine}
        />
      ) : (
        <div className="relative border-s border-border/60 ms-4 space-y-6">
          {history.map((visit) => (
            <div key={visit.id} className="mb-6 ms-6 group">
              <span className="absolute flex items-center justify-center size-7 bg-emerald-500/10 text-emerald-600 rounded-full -ms-[43px] ring-4 ring-background border border-emerald-500/30">
                <RiStethoscopeLine className="size-3.5" />
              </span>

              <Card className="border-border/50 shadow-xs hover:border-emerald-500/30 transition-all">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[11px] font-semibold ${
                        visit.visit_type === "follow_up"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                      {visit.visit_type === "follow_up"
                        ? t("modal.fields.followUp")
                        : t("modal.fields.checkup")}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <RiCalendarEventLine className="size-3.5" />
                      {new Date(visit.created_at).toLocaleDateString("ar-EG", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditVisit(visit)}
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                    <RiEdit2Line className="size-3.5" />
                    <span>{t("buttons.editVisit")}</span>
                  </Button>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3.5">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                      <RiFileTextLine className="size-3.5 text-emerald-600" />
                      <span>{t("history.diagnosisLabel")}</span>
                    </h4>
                    <p className="text-sm font-semibold text-foreground mt-1 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                      {visit.diagnosis || "—"}
                    </p>
                  </div>

                  {visit.doctor_notes && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground">
                        {t("history.notesLabel")}
                      </h4>
                      <p className="text-xs text-foreground/80 mt-0.5 italic">
                        {visit.doctor_notes}
                      </p>
                    </div>
                  )}

                  {visit.prescription && visit.prescription.length > 0 && (
                    <div className="pt-2 border-t border-border/20">
                      <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1 mb-2">
                        <RiCapsuleLine className="size-3.5 text-emerald-600" />
                        <span>{t("history.prescriptionLabel")}</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {visit.prescription.map((med, idx) => (
                          <div
                            key={med.id || idx}
                            className="p-2.5 rounded-xl border border-border/40 bg-background flex flex-col justify-between">
                            <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                              {med.medication}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                              {med.strength && (
                                <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                                  {med.strength}
                                </Badge>
                              )}
                              {med.frequency && <span>{med.frequency}</span>}
                              {med.duration && (
                                <span className="text-foreground/70 font-medium">
                                  ({med.duration})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      <CreateVisitDrawer
        visitToEdit={visitToEdit}
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setVisitToEdit(null);
        }}
        showTrigger={false}
      />
    </div>
  );
}

export default PatientHistoryTimeline;
