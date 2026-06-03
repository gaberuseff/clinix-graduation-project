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

function CreateSecretariesDrawer() {
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
          <span>Add Secretary</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col h-full bg-background border-l border-border/50 p-0">
        <SheetHeader className="p-6 pb-6 border-b border-border/10">
          <div className="flex items-center gap-2 text-primary">
            <RiUser3Line className="size-6 text-primary" />
            <SheetTitle className="text-xl font-bold tracking-tight">
              Add New Secretary
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground mt-1">
            Register a new secretary account. They will be able to log in using
            their email and password.
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
                <span>Full Name</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder="e.g. Sarah Smith"
                className="w-full mt-1"
                {...register("name", {
                  required: "Secretary name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
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
                <span>Phone Number</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="phone"
                type="tel"
                autoComplete="off"
                placeholder="e.g. +1234567890"
                className="w-full mt-1"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+]*[0-9\s-]*$/,
                    message: "Please enter a valid phone number",
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
                <span>Email Address</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="e.g. sarah@example.com"
                className="w-full mt-1"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
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
                <span>Password</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="off"
                placeholder="••••••••"
                className="w-full mt-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
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
                <span>Confirm Password</span>
                <span className="text-destructive font-bold text-xs">*</span>
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="off"
                placeholder="••••••••"
                className="w-full mt-1"
                {...register("confirmPassword", {
                  required: "Password confirmation is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreatingSecretary}
              className="flex-1 flex items-center justify-center gap-2">
              {isCreatingSecretary && <Spinner className="size-4" />}
              <span>Add Secretary</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default CreateSecretariesDrawer;
