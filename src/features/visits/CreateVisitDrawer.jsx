import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {Spinner} from "@/components/ui/spinner";
import useUser from "@/features/auth/useUser";
import {
  RiStethoscopeLine,
  RiUser3Line,
  RiPhoneLine,
  RiAddLine,
  RiDeleteBinLine,
  RiCapsuleLine,
  RiFileTextLine,
  RiCheckLine,
} from "@remixicon/react";
import {useState, useEffect} from "react";
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateVisit from "./useCreateVisit";
import useUpdateVisit from "./useUpdateVisit";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Badge} from "@/components/ui/badge";

function CreateVisitDrawer({
  visitToEdit,
  defaultPatient,
  appointmentId,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
  triggerText,
}) {
  const {t} = useAppTranslation("visits");
  const [localIsOpen, setLocalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : localIsOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange : setLocalIsOpen;

  const isEditSession = Boolean(visitToEdit?.id);

  const {createVisit, isCreating} = useCreateVisit();
  const {updateVisit, isUpdating} = useUpdateVisit();
  const isPending = isCreating || isUpdating;

  const {user} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      patient_name: "",
      patient_phone: "",
      visit_type: "checkup",
      diagnosis: "",
      doctor_notes: "",
      prescription: [
        {medication: "", strength: "", frequency: "", duration: ""},
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "prescription",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditSession && visitToEdit) {
        reset({
          patient_name: visitToEdit.patient_name || "",
          patient_phone: visitToEdit.patient_phone || "",
          visit_type: visitToEdit.visit_type || "checkup",
          diagnosis: visitToEdit.diagnosis || "",
          doctor_notes: visitToEdit.doctor_notes || "",
          prescription:
            visitToEdit.prescription && visitToEdit.prescription.length > 0
              ? visitToEdit.prescription
              : [{medication: "", strength: "", frequency: "", duration: ""}],
        });
      } else if (defaultPatient) {
        reset({
          patient_name: defaultPatient.name || defaultPatient.patient_name || "",
          patient_phone: defaultPatient.phone || defaultPatient.patient_phone || "",
          visit_type: defaultPatient.type || "checkup",
          diagnosis: "",
          doctor_notes: "",
          prescription: [
            {medication: "", strength: "", frequency: "", duration: ""},
          ],
        });
      } else {
        reset({
          patient_name: "",
          patient_phone: "",
          visit_type: "checkup",
          diagnosis: "",
          doctor_notes: "",
          prescription: [
            {medication: "", strength: "", frequency: "", duration: ""},
          ],
        });
      }
    }
  }, [isOpen, isEditSession, visitToEdit, defaultPatient, reset]);

  const onSubmit = (data) => {
    if (!clinicId) return;

    const cleanedPrescription = (data.prescription || [])
      .filter((item) => item.medication && item.medication.trim() !== "")
      .map((item, idx) => ({
        id: item.id || `med-${Date.now()}-${idx}`,
        medication: item.medication.trim(),
        strength: item.strength ? item.strength.trim() : "",
        frequency: item.frequency ? item.frequency.trim() : "",
        duration: item.duration ? item.duration.trim() : "",
      }));

    const visitPayload = {
      clinic_id: clinicId,
      patient_name: data.patient_name.trim(),
      patient_phone: data.patient_phone.trim(),
      visit_type: data.visit_type,
      diagnosis: data.diagnosis.trim(),
      doctor_notes: data.doctor_notes ? data.doctor_notes.trim() : "",
      prescription: cleanedPrescription,
      appointment_id: appointmentId || defaultPatient?.id || null,
      patient_id: defaultPatient?.patient_id || defaultPatient?.id || null,
    };

    if (isEditSession) {
      updateVisit(
        {
          id: visitToEdit.id,
          updatedFields: {
            patient_name: visitPayload.patient_name,
            patient_phone: visitPayload.patient_phone,
            visit_type: visitPayload.visit_type,
            diagnosis: visitPayload.diagnosis,
            doctor_notes: visitPayload.doctor_notes,
            prescription: visitPayload.prescription,
          },
        },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        },
      );
    } else {
      createVisit(visitPayload, {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      });
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {showTrigger && !isEditSession && (
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
            <RiStethoscopeLine className="size-4" />
            <span>{triggerText || t("buttons.addVisit")}</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col h-full bg-background border-l border-border/50 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border/10">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-500">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <RiStethoscopeLine className="size-6 text-emerald-600" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight">
                {isEditSession ? t("buttons.editVisit") : t("modal.title")}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {t("modal.desc")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex-1 flex flex-col justify-between px-6 py-5 overflow-y-auto space-y-6">
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors?.patient_name}>
                <FieldLabel
                  htmlFor="patient_name"
                  className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                  <RiUser3Line className="size-3.5 text-muted-foreground" />
                  <span>{t("modal.fields.patientName")}</span>
                  <span className="text-destructive font-bold text-xs">*</span>
                </FieldLabel>
                <Input
                  id="patient_name"
                  type="text"
                  placeholder={t("modal.placeholders.patientName")}
                  className="w-full mt-1 text-sm"
                  {...register("patient_name", {
                    required: t("modal.errors.nameRequired"),
                  })}
                />
                <FieldError>{errors?.patient_name?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors?.patient_phone}>
                <FieldLabel
                  htmlFor="patient_phone"
                  className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                  <RiPhoneLine className="size-3.5 text-emerald-600" />
                  <span>{t("modal.fields.patientPhone")}</span>
                  <span className="text-destructive font-bold text-xs">*</span>
                </FieldLabel>
                <Input
                  id="patient_phone"
                  type="tel"
                  placeholder={t("modal.placeholders.patientPhone")}
                  className="w-full mt-1 text-sm font-mono"
                  dir="ltr"
                  {...register("patient_phone", {
                    required: t("modal.errors.phoneRequired"),
                  })}
                />
                <FieldError>{errors?.patient_phone?.message}</FieldError>
              </Field>
            </div>

            <Field data-invalid={!!errors?.visit_type}>
              <FieldLabel className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                <span>{t("modal.fields.visitType")}</span>
              </FieldLabel>
              <Controller
                control={control}
                name="visit_type"
                render={({field}) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="checkup">
                        {t("modal.fields.checkup")}
                      </SelectItem>
                      <SelectItem value="follow_up">
                        {t("modal.fields.followUp")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field data-invalid={!!errors?.diagnosis}>
              <FieldLabel
                htmlFor="diagnosis"
                className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                <RiFileTextLine className="size-3.5 text-muted-foreground" />
                <span>{t("modal.fields.diagnosis")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Textarea
                id="diagnosis"
                rows={3}
                placeholder={t("modal.placeholders.diagnosis")}
                className="w-full mt-1 text-sm resize-none"
                {...register("diagnosis", {
                  required: t("modal.errors.diagnosisRequired"),
                })}
              />
              <FieldError>{errors?.diagnosis?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="doctor_notes"
                className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                <span>{t("modal.fields.doctorNotes")}</span>
              </FieldLabel>
              <Textarea
                id="doctor_notes"
                rows={2}
                placeholder={t("modal.placeholders.doctorNotes")}
                className="w-full mt-1 text-sm resize-none"
                {...register("doctor_notes")}
              />
            </Field>

            <div className="space-y-3 pt-2 border-t border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <RiCapsuleLine className="size-4 text-emerald-600" />
                  <span className="text-sm font-bold text-foreground">
                    {t("modal.fields.prescription")}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      medication: "",
                      strength: "",
                      frequency: "",
                      duration: "",
                    })
                  }
                  className="h-8 text-xs gap-1 border-emerald-600/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                  <RiAddLine className="size-3.5" />
                  <span>{t("buttons.addMedication")}</span>
                </Button>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pe-1">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-2 relative">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        #{index + 1}
                      </Badge>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-6 w-6 text-destructive hover:bg-destructive/10">
                          <RiDeleteBinLine className="size-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder={t("modal.placeholders.medName")}
                        className="text-xs h-8 bg-background"
                        {...register(`prescription.${index}.medication`)}
                      />
                      <Input
                        placeholder={t("modal.placeholders.strength")}
                        className="text-xs h-8 bg-background"
                        {...register(`prescription.${index}.strength`)}
                      />
                      <Input
                        placeholder={t("modal.placeholders.frequency")}
                        className="text-xs h-8 bg-background"
                        {...register(`prescription.${index}.frequency`)}
                      />
                      <Input
                        placeholder={t("modal.placeholders.duration")}
                        className="text-xs h-8 bg-background"
                        {...register(`prescription.${index}.duration`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FieldGroup>

          <div className="pt-4 border-t border-border/10 flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              className="flex-1">
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              {isPending ? (
                <Spinner className="size-4" />
              ) : (
                <RiCheckLine className="size-4" />
              )}
              <span>{t("buttons.saveVisit")}</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default CreateVisitDrawer;
