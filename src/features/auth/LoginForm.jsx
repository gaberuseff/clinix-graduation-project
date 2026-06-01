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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import {cn} from "@/lib/utils";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import useLogin from "./useLogin";

import useLoginPasskey from "./useLoginPasskey";
import {RiFingerprintLine} from "@remixicon/react";

export function LoginForm({className, ...props}) {
  const {login, isLoggingIn} = useLogin();
  const {loginPasskey, isLoggingInPasskey} = useLoginPasskey();

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: "dev.gaber@gmail.com",
      password: "12345678",
    },
  });

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors?.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
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
              <Field data-invalid={!!errors?.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
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
              <Field>
                <Button
                  type="submit"
                  disabled={isLoggingIn || isLoggingInPasskey}
                  className="w-full">
                  {isLoggingIn && <Spinner className="size-5" />}
                  Login
                </Button>
              </Field>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60"></div>
                </div>
                <span className="relative px-3 bg-card text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Or secure access
                </span>
              </div>

              <Field>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoggingIn || isLoggingInPasskey}
                  onClick={loginPasskey}
                  className="w-full flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 font-semibold cursor-pointer">
                  {isLoggingInPasskey ? (
                    <Spinner className="size-4" />
                  ) : (
                    <RiFingerprintLine className="size-4" />
                  )}
                  Sign in with Passkey
                </Button>
                <FieldDescription className="text-center mt-2">
                  Don&apos;t have an account?{" "}
                  <Link to="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
