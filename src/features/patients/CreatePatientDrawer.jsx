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
import useUser from "@/features/auth/useUser";
import {
  RiCalendarEventLine,
  RiPhoneLine,
  RiUser3Line,
  RiUserAddLine,
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
import useCreatePatient from "./useCreatePatient";
import useUpdatePatient from "./useUpdatePatient";

function CreatePatientDrawer({
  patientToEdit,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}) {
  const [localIsOpen, setLocalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : localIsOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange : setLocalIsOpen;

  const isEditSession = Boolean(patientToEdit?.id);

  const {createPatient, isCreating} = useCreatePatient();
  const {updatePatient, isUpdating} = useUpdatePatient();
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
      name: "",
      phone: "",
      birth_year: "",
      gender: "male",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditSession && patientToEdit) {
        reset({
          name: patientToEdit.name || "",
          phone: patientToEdit.phone || "",
          birth_year: patientToEdit.birth_year || "",
          gender: patientToEdit.gender || "male",
        });
      } else {
        reset({
          name: "",
          phone: "",
          birth_year: "",
          gender: "male",
        });
      }
    }
  }, [isOpen, isEditSession, patientToEdit, reset]);

  const onSubmit = (data) => {
    if (!clinicId) {
      return;
    }

    const patientData = {
      name: data.name.trim(),
      phone: data.phone ? data.phone.trim() : null,
      birth_year: data.birth_year ? Number(data.birth_year) : null,
      gender: data.gender,
      clinic_id: clinicId,
    };

    if (isEditSession) {
      updatePatient(
        {
          id: patientToEdit.id,
          updatedFields: {
            name: patientData.name,
            phone: patientData.phone,
            birth_year: patientData.birth_year,
            gender: patientData.gender,
          },
        },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        },
      );
    } else {
      createPatient(patientData, {
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
          <Button className="flex items-center gap-2 font-semibold">
            <RiUserAddLine className="size-4" />
            <span>Add Patient</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col h-full bg-background border-l border-border/50 p-0">
        <SheetHeader className="p-6 pb-6 border-b border-border/10">
          <div className="flex items-center gap-2 text-primary">
            <RiUser3Line className="size-6 text-primary" />
            <SheetTitle className="text-xl font-bold tracking-tight">
              {isEditSession ? "Edit Patient Details" : "Add New Patient"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground mt-1">
            {isEditSession
              ? "Update the patient's personal and contact details."
              : "Register a new patient by entering their details below. Full name and phone number are required."}
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
                placeholder="e.g. John Doe"
                className="w-full mt-1"
                {...register("name", {
                  required: "Patient name is required",
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

            {/* Birth Year */}
            <Field data-invalid={!!errors?.birth_year}>
              <FieldLabel
                htmlFor="birth_year"
                className="text-sm font-semibold flex items-center gap-1.5">
                <RiCalendarEventLine className="size-4 text-muted-foreground/75" />
                <span>Birth Year</span>
              </FieldLabel>
              <Input
                id="birth_year"
                type="number"
                autoComplete="off"
                placeholder="e.g. 1995"
                className="w-full mt-1"
                {...register("birth_year", {
                  min: {
                    value: 1900,
                    message: "Birth year must be after 1900",
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: `Birth year cannot exceed ${new Date().getFullYear()}`,
                  },
                })}
              />
              <FieldError>{errors?.birth_year?.message}</FieldError>
            </Field>

            {/* Gender Selection (Select Dropdown) */}
            <Field data-invalid={!!errors?.gender}>
              <FieldLabel
                htmlFor="gender"
                className="text-sm font-semibold flex items-center gap-1.5">
                <span>Gender</span>
              </FieldLabel>
              <Controller
                control={control}
                name="gender"
                rules={{required: "Gender is required"}}
                render={({field}) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="w-[var(--radix-select-trigger-width)]">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors?.gender?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-border/10 flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2">
              {isPending && <Spinner className="size-4" />}
              <span>{isEditSession ? "Save Changes" : "Save Patient"}</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default CreatePatientDrawer;
