import {SignupForm} from "@/features/auth/SignupForm";

function Register() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm md:max-w-5xl flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
}

export default Register;
