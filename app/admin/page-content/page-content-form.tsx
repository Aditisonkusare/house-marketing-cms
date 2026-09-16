"use client";

import { useActionState } from "react";
import type { PageContent, PageContentFormState } from "@/app/admin/page-content/actions";

const initialState: PageContentFormState = {};

export function PageContentForm({
  action,
  defaultValues,
}: {
  action: (prevState: PageContentFormState, formData: FormData) => Promise<PageContentFormState>;
  defaultValues?: PageContent;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}
      <Field label="Slug">
        <input name="slug" required defaultValue={defaultValues?.slug} className="input" />
      </Field>
      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title ?? ""} className="input" />
      </Field>
      <Field label="Content (JSON)">
        <textarea
          name="content"
          required
          defaultValue={
            defaultValues ? JSON.stringify(defaultValues.content, null, 2) : "{\n  \n}"
          }
          className="input font-mono"
          rows={10}
        />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={defaultValues?.status ?? "DRAFT"} className="input">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900"
      >
        {isPending ? "Saving..." : "Save"}
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
        @media (prefers-color-scheme: dark) {
          .input {
            background: #111827;
            border-color: #374151;
            color: #f3f4f6;
          }
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
}
