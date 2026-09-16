"use client";

import { useActionState } from "react";
import { registerSubscriberAction, type RegisterState } from "@/app/(site)/register/actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerSubscriberAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-medium">Thanks for registering!</p>
        <p className="mt-1 text-sm">We&apos;ll keep you posted on new house types and updates.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <Field label="Name" error={state.errors?.name}>
        <input name="name" type="text" required className="input" />
      </Field>
      <Field label="Email" error={state.errors?.email}>
        <input name="email" type="email" required className="input" />
      </Field>
      <div>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input name="consent" type="checkbox" className="mt-0.5" />
          <span>I consent to being contacted with updates about this development.</span>
        </label>
        {state.errors?.consent && <p className="mt-1 text-sm text-red-600">{state.errors.consent[0]}</p>}
      </div>

      {state.errors?.form && <p className="text-sm text-red-600">{state.errors.form[0]}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Register"}
      </button>

      <style jsx>{`
        .input {
          display: block;
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error[0]}</p>}
    </div>
  );
}
