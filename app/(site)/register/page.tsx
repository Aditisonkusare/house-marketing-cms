import { RegisterForm } from "@/app/(site)/register/register-form";

export const metadata = {
  title: "Register for Updates | Glenveagh Homes",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Register for updates</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Leave your details and we&apos;ll email you when new house types, phases, or news go live.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
