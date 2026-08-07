import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {Spinner} from "@/components/ui/spinner";
import {
  RiCalendarEventLine,
  RiPhoneLine,
  RiUser3Line,
  RiAddCircleLine,
  RiMoneyDollarCircleLine,
  RiBookmarkLine,
} from "@remixicon/react";
import {useState, useEffect} from "react";
import {useForm, Controller} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateAppointment from "./useCreateAppointment";
import useClinicSettingsCached from "@/features/settings/useClinicSettingsCached";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {formatCurrency} from "@/utils/helpers";

function CreateAppointmentDrawer({
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}) {
  const {t} = useAppTranslation("appointments");
  const [localIsOpen, setLocalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : localIsOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange : setLocalIsOpen;

  const {createAppointment, isCreating} = useCreateAppointment();
  const {settings, isLoading: isLoadingSettings, clinicId} = useClinicSettingsCached();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      type: "",
      price: "",
      date: "",
    },
  });

  const selectedType = watch("type");
  const checkupFee = settings?.checkup_fee ?? 0;
  const followUpFee = settings?.follow_up_fee ?? 0;
  const currency = settings?.price_currency || "EGP";

  // Auto-fill price based on selected type
  useEffect(() => {
    if (selectedType === "checkup") {
      setValue("price", checkupFee);
    } else if (selectedType === "followup") {
      setValue("price", followUpFee);
    } else {
      setValue("price", "");
    }
  }, [selectedType, checkupFee, followUpFee, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        phone: "",
        type: "",
        price: "",
        date: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    if (!clinicId) return;

    // Convert date string to ISO timezone format
    const appointmentData = {
      name: data.name.trim(),
      phone: data.phone ? Number(data.phone.trim()) : null,
      type: data.type,
      price: Number(data.price),
      date: new Date(data.date).toISOString(),
      status: "pending",
      clinic_id: clinicId,
    };

    createAppointment(appointmentData, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2 font-semibold">
            <RiAddCircleLine className="size-4" />
            <span>{t("buttons.addBooking")}</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col h-full bg-background border-l border-border/50 p-0">
        <SheetHeader className="p-6 pb-6 border-b border-border/10">
          <div className="flex items-center gap-2 text-primary">
            <RiBookmarkLine className="size-6 text-primary" />
            <SheetTitle className="text-xl font-bold tracking-tight">
              {t("modal.add.title")}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground mt-1">
            {t("modal.add.desc")}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex-1 flex flex-col justify-between px-6 py-6 overflow-y-auto">
          <FieldGroup className="gap-6">
            {/* Patient Name */}
            <Field data-invalid={!!errors?.name}>
              <FieldLabel
                htmlFor="name"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiUser3Line className="size-4 text-muted-foreground/75" />
                <span>{t("table.columns.name")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder={t("modal.add.placeholders.name")}
                className="w-full mt-1"
                {...register("name", {
                  required: t("modal.add.errors.nameRequired"),
                })}
              />
              <FieldError>{errors?.name?.message}</FieldError>
            </Field>

            {/* Patient Phone */}
            <Field data-invalid={!!errors?.phone}>
              <FieldLabel
                htmlFor="phone"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiPhoneLine className="size-4 text-muted-foreground/75" />
                <span>{t("table.columns.phone")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="phone"
                type="tel"
                autoComplete="off"
                placeholder={t("modal.add.placeholders.phone")}
                className="w-full mt-1"
                {...register("phone", {
                  required: t("modal.add.errors.phoneRequired"),
                  pattern: {
                    value: /^[0-9\s-]*$/,
                    message: t("modal.add.errors.phoneRequired"),
                  },
                })}
              />
              <FieldError>{errors?.phone?.message}</FieldError>
            </Field>

            {/* Booking Type */}
            <Field data-invalid={!!errors?.type}>
              <FieldLabel
                htmlFor="type"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiBookmarkLine className="size-4 text-muted-foreground/75" />
                <span>{t("table.columns.type")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="type"
                rules={{required: t("modal.add.errors.typeRequired")}}
                render={({field}) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingSettings}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder={t("modal.add.placeholders.type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkup">
                        {t("modal.add.placeholders.checkup")} ({formatCurrency(checkupFee, currency)})
                      </SelectItem>
                      <SelectItem value="followup">
                        {t("modal.add.placeholders.followup")} ({formatCurrency(followUpFee, currency)})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors?.type?.message}</FieldError>
            </Field>

            {/* Appointment Price (Read Only) */}
            <Field data-invalid={!!errors?.price}>
              <FieldLabel
                htmlFor="price"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiMoneyDollarCircleLine className="size-4 text-muted-foreground/75" />
                <span>{t("table.columns.price")} ({currency})</span>
              </FieldLabel>
              <Input
                id="price"
                type="text"
                readOnly
                placeholder="0"
                className="w-full mt-1 bg-muted font-semibold text-foreground/80 cursor-not-allowed select-none"
                {...register("price")}
              />
            </Field>

            {/* Appointment Date */}
            <Field data-invalid={!!errors?.date}>
              <FieldLabel
                htmlFor="date"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiCalendarEventLine className="size-4 text-muted-foreground/75" />
                <span>{t("table.columns.date")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="date"
                type="datetime-local"
                className="w-full mt-1"
                {...register("date", {
                  required: t("modal.add.errors.dateRequired"),
                })}
              />
              <FieldError>{errors?.date?.message}</FieldError>
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-border/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreating}>
              {t("buttons.close")}
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Spinner className="size-4" />}
              <span>{t("buttons.save")}</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default CreateAppointmentDrawer;
