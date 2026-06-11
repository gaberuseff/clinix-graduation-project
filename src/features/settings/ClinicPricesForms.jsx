import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {formatCurrency} from "@/utils/helpers";
import {Spinner} from "@/components/ui/spinner";
import useClinicSettings from "./useClinicSettings";
import useUpdateClinicSettings from "./useUpdateClinicSettings";

function ClinicPricesForms() {
  const {settings, isLoading, clinicId} = useClinicSettings();
  const {updateSettings, isUpdating} = useUpdateClinicSettings();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      checkup_fee: "",
      follow_up_fee: "",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        checkup_fee: settings.checkup_fee ?? "",
        follow_up_fee: settings.follow_up_fee ?? "",
      });
    }
  }, [settings, reset]);

  const currency = settings?.price_currency || "EGP";
  const checkupFee = watch("checkup_fee");
  const followUpFee = watch("follow_up_fee");

  const onSubmit = (data) => {
    if (!clinicId) return;

    updateSettings({
      clinicId,
      updatedFields: {
        checkup_fee: data.checkup_fee === "" ? null : Number(data.checkup_fee),
        follow_up_fee:
          data.follow_up_fee === "" ? null : Number(data.follow_up_fee),
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
        <CardTitle>Appointment Fees</CardTitle>
        <CardDescription>
          Configure default billing rates for checkups and follow-up
          consultations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-6">
            {/* Checkup Fee */}
            <Field data-invalid={!!errors?.checkup_fee}>
              <FieldLabel htmlFor="checkup_fee">
                Checkup Fee ({currency})
              </FieldLabel>
              <Input
                id="checkup_fee"
                type="number"
                placeholder="e.g. 200"
                disabled={isUpdating}
                {...register("checkup_fee", {
                  min: {
                    value: 0,
                    message: "Fee cannot be negative",
                  },
                })}
              />
              {checkupFee && !errors?.checkup_fee && (
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Preview:{" "}
                  <span className="text-foreground font-semibold">
                    {formatCurrency(checkupFee, currency)}
                  </span>
                </p>
              )}
              <FieldError>{errors?.checkup_fee?.message}</FieldError>
            </Field>

            {/* Follow-up Fee */}
            <Field data-invalid={!!errors?.follow_up_fee}>
              <FieldLabel htmlFor="follow_up_fee">
                Follow-up Fee ({currency})
              </FieldLabel>
              <Input
                id="follow_up_fee"
                type="number"
                placeholder="e.g. 100"
                disabled={isUpdating}
                {...register("follow_up_fee", {
                  min: {
                    value: 0,
                    message: "Fee cannot be negative",
                  },
                })}
              />
              {followUpFee && !errors?.follow_up_fee && (
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Preview:{" "}
                  <span className="text-foreground font-semibold">
                    {formatCurrency(followUpFee, currency)}
                  </span>
                </p>
              )}
              <FieldError>{errors?.follow_up_fee?.message}</FieldError>
            </Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/10">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Spinner className="size-4" />}
                Save Settings
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default ClinicPricesForms;
