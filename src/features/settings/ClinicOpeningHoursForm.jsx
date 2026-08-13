import {useCallback, useEffect} from "react";
import {useForm, useFieldArray, Controller} from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {useAppTranslation} from "@/i18n/use-app-translation";
import useClinicSettings from "./useClinicSettings";
import useUpdateClinicSettings from "./useUpdateClinicSettings";

const DEFAULT_DAYS = [
  {day: "saturday", is_open: false, start_time: "09:00", end_time: "17:00"},
  {day: "sunday", is_open: false, start_time: "09:00", end_time: "17:00"},
  {day: "monday", is_open: false, start_time: "09:00", end_time: "17:00"},
  {day: "tuesday", is_open: false, start_time: "09:00", end_time: "17:00"},
  {day: "wednesday", is_open: false, start_time: "09:00", end_time: "17:00"},
  {day: "thursday", is_open: false, start_time: "09:00", end_time: "17:00"},
  {day: "friday", is_open: false, start_time: "09:00", end_time: "17:00"},
];

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  const hourStr = String(h).padStart(2, "0");
  TIME_OPTIONS.push(`${hourStr}:00`);
  TIME_OPTIONS.push(`${hourStr}:30`);
}

function ClinicOpeningHoursForm() {
  const {t, i18n} = useAppTranslation("settings");
  const isAr = i18n.language === "ar";

  const {settings, isLoading, clinicId} = useClinicSettings();
  const {updateSettings, isUpdating} = useUpdateClinicSettings();

  const getDayName = (dayId) => {
    const daysMap = {
      saturday: isAr ? "السبت" : "Saturday",
      sunday: isAr ? "الأحد" : "Sunday",
      monday: isAr ? "الإثنين" : "Monday",
      tuesday: isAr ? "الثلاثاء" : "Tuesday",
      wednesday: isAr ? "الأربعاء" : "Wednesday",
      thursday: isAr ? "الخميس" : "Thursday",
      friday: isAr ? "الجمعة" : "Friday",
    };
    return daysMap[dayId] || dayId;
  };

  const formatTimeOption = (timeStr) => {
    const [hourStr, minStr] = timeStr.split(":");
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? (isAr ? "م" : "PM") : (isAr ? "ص" : "AM");
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(displayHour).padStart(2, "0")}:${minStr} ${ampm}`;
  };

  const {control, handleSubmit, reset, watch, formState: {isDirty}} = useForm({
    defaultValues: {
      days: DEFAULT_DAYS,
    },
  });

  const {fields} = useFieldArray({
    control,
    name: "days",
  });

  const initializeHours = useCallback(() => {
    if (Array.isArray(settings?.openning_time) && settings.openning_time.length > 0) {
      const existingMap = new Map(settings.openning_time.map((item) => [item.day, item]));
      return DEFAULT_DAYS.map((d) => {
        const match = existingMap.get(d.day);
        return match ? {...d, ...match} : d;
      });
    }
    return DEFAULT_DAYS;
  }, [settings?.openning_time]);

  useEffect(() => {
    if (settings) {
      reset({
        days: initializeHours(),
      });
    }
  }, [settings, reset, initializeHours]);

  const onSubmit = (data) => {
    if (!clinicId) return;

    updateSettings({
      clinicId,
      updatedFields: {
        openning_time: data.days,
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="h-[200px] flex items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("openingHours.title")}</CardTitle>
        <CardDescription>
          {t("openingHours.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3.5">
            {fields.map((field, index) => {
              const isOpen = watch(`days.${index}.is_open`);

              return (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-muted/5 hover:bg-muted/10 transition-colors">
                  
                  {/* Left Side: Toggle and Day Name */}
                  <div className="flex items-center gap-4">
                    <Controller
                      name={`days.${index}.is_open`}
                      control={control}
                      render={({field: {value, onChange}}) => (
                        <Checkbox
                          id={`days.${index}.is_open`}
                          checked={value}
                          onCheckedChange={onChange}
                          disabled={isUpdating}
                        />
                      )}
                    />
                    <label
                      htmlFor={`days.${index}.is_open`}
                      className="text-sm font-semibold text-foreground cursor-pointer select-none min-w-[80px]">
                      {getDayName(field.day)}
                    </label>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isOpen
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted border-border/50 text-muted-foreground"
                      }`}>
                      {isOpen ? t("openingHours.open") : t("openingHours.closed")}
                    </span>
                  </div>

                  {/* Right Side: Time Selects */}
                  <div className="flex items-center gap-3">
                    {isOpen ? (
                      <>
                        {/* Start Time Select */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {t("openingHours.from")}:
                          </span>
                          <Controller
                            control={control}
                            name={`days.${index}.start_time`}
                            render={({field: {value, onChange}}) => (
                              <Select
                                onValueChange={onChange}
                                value={value}
                                disabled={isUpdating}>
                                <SelectTrigger className="w-32 h-9 text-xs rounded-xl">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-[220px] overflow-y-auto">
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {formatTimeOption(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* End Time Select */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {t("openingHours.to")}:
                          </span>
                          <Controller
                            control={control}
                            name={`days.${index}.end_time`}
                            render={({field: {value, onChange}}) => (
                              <Select
                                onValueChange={onChange}
                                value={value}
                                disabled={isUpdating}>
                                <SelectTrigger className="w-32 h-9 text-xs rounded-xl">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-[220px] overflow-y-auto">
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {formatTimeOption(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium italic">
                        {isAr ? "مغلق طوال اليوم" : "Closed all day"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-border/10">
            <Button type="submit" disabled={isUpdating || !isDirty}>
              {isUpdating && <Spinner className="size-4" />}
              <span>{t("openingHours.submit")}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ClinicOpeningHoursForm;
