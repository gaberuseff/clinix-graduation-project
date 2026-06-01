import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useState} from "react";
import useSignup from "./useSignup";
import {Spinner} from "@/components/ui/spinner";

export function SignupForm({className, ...props}) {
  const [step, setStep] = useState(1);
  const {signup, isSigningUp} = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: {errors},
  } = useForm({
    defaultValues: {
      clinicName: "",
      clinicAddress: "",
      clinicSpecialty: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleNextStep = async (e) => {
    e.preventDefault();
    const isValid = await trigger([
      "clinicName",
      "clinicAddress",
      "clinicSpecialty",
    ]);
    if (isValid) setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const onSubmit = (data) => {
    signup(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Doctor Account</CardTitle>
          <CardDescription>
            {step === 1
              ? "Step 1 of 2 - Clinic information"
              : "Step 2 of 2 - Doctor information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <FieldGroup>
                <Field data-invalid={!!errors?.clinicName}>
                  <FieldLabel htmlFor="clinicName">Clinic Name</FieldLabel>
                  <Input
                    id="clinicName"
                    placeholder="Care+ Clinic"
                    {...register("clinicName", {
                      required: "Clinic name is required",
                    })}
                  />
                  <FieldError>{errors?.clinicName?.message}</FieldError>
                </Field>
                <Field data-invalid={!!errors?.clinicAddress}>
                  <FieldLabel htmlFor="clinicAddress">
                    Clinic Address
                  </FieldLabel>
                  <Input
                    id="clinicAddress"
                    placeholder="123 Main Street"
                    {...register("clinicAddress", {
                      required: "Clinic address is required",
                    })}
                  />
                  <FieldError>{errors?.clinicAddress?.message}</FieldError>
                </Field>
                <Field data-invalid={!!errors?.clinicSpecialty}>
                  <FieldLabel htmlFor="clinicSpecialty">
                    Clinic Specialty
                  </FieldLabel>
                  <Input
                    id="clinicSpecialty"
                    placeholder="Dermatology"
                    {...register("clinicSpecialty", {
                      required: "Clinic specialty is required",
                    })}
                  />
                  <FieldError>{errors?.clinicSpecialty?.message}</FieldError>
                </Field>
                <Field>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full">
                    Continue
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link to="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            )}

            {step === 2 && (
              <FieldGroup>
                <Field data-invalid={!!errors?.fullName}>
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="Dr. John Doe"
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                  />
                  <FieldError>{errors?.fullName?.message}</FieldError>
                </Field>
                <Field data-invalid={!!errors?.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
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
                <Field data-invalid={!!errors?.phone}>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="+201001234567"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                  />
                  <FieldError>{errors?.phone?.message}</FieldError>
                </Field>
                <Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field data-invalid={!!errors?.password}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                      />
                      <FieldError>{errors?.password?.message}</FieldError>
                    </Field>
                    <Field data-invalid={!!errors?.confirmPassword}>
                      <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                        })}
                      />
                      <FieldError>
                        {errors?.confirmPassword?.message}
                      </FieldError>
                    </Field>
                  </div>
                  <FieldDescription>
                    Password must be at least 8 characters.
                  </FieldDescription>
                </Field>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1"
                    disabled={isSigningUp}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSigningUp}>
                    {isSigningUp && <Spinner className="size-5" />}
                    Create Account
                  </Button>
                </div>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
