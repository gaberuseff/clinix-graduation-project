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
import {useState} from "react";
import {useForm} from "react-hook-form";
import {
  RiPhoneLine,
  RiUser3Line,
  RiUserAddLine,
  RiMailLine,
  RiLockLine,
} from "@remixicon/react";
import useCreateSecretaries from "./useCreateSecretaries";
import {Spinner} from "@/components/ui/spinner";
import {useAppTranslation} from "@/i18n/use-app-translation";

function CreateSecretariesDrawer() {
  const {t} = useAppTranslation("secretaries");
  const [isOpen, setIsOpen] = useState(false);

  const {createSecretary, isCreatingSecretary} =
    useCreateSecretaries();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    createSecretary(data, {
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
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 font-semibold">
          <RiUserAddLine className="size-4" />
          <span>{t("drawer.trigger")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col h-full bg-background border-l border-border/50 p-0">
        <SheetHeader className="p-6 pb-6 border-b border-border/10">
          <div className="flex items-center gap-2 text-primary">
            <RiUser3Line className="size-6 text-primary" />
            <SheetTitle className="text-xl font-bold tracking-tight">
              {t("drawer.title")}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground mt-1">
            {t("drawer.description")}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex-1 flex flex-col justify-between px-6 py-6 overflow-y-auto">
          <FieldGroup className="gap-6">
            {/* Full Name */}
            <Field data-invalid={!!errors?.name}>
              <FieldLabel
                htmlFor="name"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiUser3Line className="size-4 text-muted-foreground/75" />
                <span>{t("drawer.fields.fullName")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder={t("drawer.fields.fullNamePlaceholder")}
                className="w-full mt-1"
                {...register("name", {
                  required: t("drawer.errors.nameRequired"),
                  minLength: {
                    value: 2,
                    message: t("drawer.errors.nameMin"),
                  },
                })}
              />
              <FieldError>{errors?.name?.message}</FieldError>
            </Field>

            {/* Phone Number */}
            <Field data-invalid={!!errors?.phone}>
              <FieldLabel
                htmlFor="phone"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiPhoneLine className="size-4 text-muted-foreground/75" />
                <span>{t("drawer.fields.phone")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="phone"
                type="tel"
                autoComplete="off"
                placeholder={t("drawer.fields.phonePlaceholder")}
                className="w-full mt-1"
                {...register("phone", {
                  required: t("drawer.errors.phoneRequired"),
                  pattern: {
                    value: /^[+]*[0-9\s-]*$/,
                    message: t("drawer.errors.phonePattern"),
                  },
                })}
              />
              <FieldError>{errors?.phone?.message}</FieldError>
            </Field>

            {/* Email Address */}
            <Field data-invalid={!!errors?.email}>
              <FieldLabel
                htmlFor="email"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiMailLine className="size-4 text-muted-foreground/75" />
                <span>{t("drawer.fields.email")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder={t("drawer.fields.emailPlaceholder")}
                className="w-full mt-1"
                {...register("email", {
                  required: t("drawer.errors.emailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("drawer.errors.emailPattern"),
                  },
                })}
              />
              <FieldError>{errors?.email?.message}</FieldError>
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors?.password}>
              <FieldLabel
                htmlFor="password"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiLockLine className="size-4 text-muted-foreground/75" />
                <span>{t("drawer.fields.password")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="off"
                placeholder="••••••••"
                className="w-full mt-1"
                {...register("password", {
                  required: t("drawer.errors.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("drawer.errors.passwordMin"),
                  },
                })}
              />
              <FieldError>{errors?.password?.message}</FieldError>
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!errors?.confirmPassword}>
              <FieldLabel
                htmlFor="confirmPassword"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiLockLine className="size-4 text-muted-foreground/75" />
                <span>{t("drawer.fields.confirmPassword")}</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="off"
                placeholder="••••••••"
                className="w-full mt-1"
                {...register("confirmPassword", {
                  required: t("drawer.errors.confirmRequired"),
                  validate: (value) =>
                    value === watch("password") || t("drawer.errors.confirmMatch"),
                })}
              />
              <FieldError>{errors?.confirmPassword?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-border/10 flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isCreatingSecretary}
              onClick={() => setIsOpen(false)}
              className="flex-1">
              {t("drawer.buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isCreatingSecretary}
              className="flex-1 flex items-center justify-center gap-2">
              {isCreatingSecretary && <Spinner className="size-4" />}
              <span>{t("drawer.buttons.submit")}</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default CreateSecretariesDrawer;
