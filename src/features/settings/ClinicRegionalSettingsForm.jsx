import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Spinner} from "@/components/ui/spinner";
import {ARAB_COUNTRIES} from "@/utils/countries";
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import useClinicSettings from "./useClinicSettings";
import useUpdateClinicSettings from "./useUpdateClinicSettings";

function ClinicRegionalSettingsForm() {
  const {settings, isLoading, clinicId} = useClinicSettings();
  const {updateSettings, isUpdating} = useUpdateClinicSettings();

  const {
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      price_currency: "EGP",
    },
  });

  // Load saved currency value from database settings when it loads
  useEffect(() => {
    if (settings?.price_currency) {
      reset({
        price_currency: settings.price_currency.toUpperCase(),
      });
    }
  }, [settings, reset]);

  const onSubmit = (data) => {
    if (!clinicId) return;

    updateSettings({
      clinicId,
      updatedFields: {
        price_currency: data.price_currency,
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[200px] flex items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Settings</CardTitle>
        <CardDescription>
          Select your country to set the clinic's default currency and
          localization preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-6">
            <Field data-invalid={!!errors?.price_currency}>
              <FieldLabel htmlFor="price_currency">
                Clinic Currency / Country
              </FieldLabel>
              <Controller
                control={control}
                name="price_currency"
                rules={{required: "Currency is required"}}
                render={({field}) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isUpdating}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select Country & Currency" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto">
                      {ARAB_COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.currency}>
                          {country.nameAr} ({country.currency} -{" "}
                          {country.currencySymbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors?.price_currency?.message}</FieldError>
            </Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/10">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Spinner className="size-4" />}
                <span>Save Regional Settings</span>
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default ClinicRegionalSettingsForm;
