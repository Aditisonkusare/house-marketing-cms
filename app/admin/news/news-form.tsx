"use client";

import type { NewsPost } from "@/app/admin/news/actions";

export function NewsForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: NewsPost;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <Field label="Title">
        <input name="title" required defaultValue={defaultValues?.title} className="input" />
      </Field>
      <Field label="Slug">
        <input name="slug" required defaultValue={defaultValues?.slug} className="input" />
      </Field>
      <Field label="Excerpt">
        <input name="excerpt" defaultValue={defaultValues?.excerpt ?? ""} className="input" />
      </Field>
      <Field label="Body">
        <textarea name="body" required defaultValue={defaultValues?.body} className="input" rows={8} />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={defaultValues?.status ?? "DRAFT"} className="input">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </Field>

      <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
        Save
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
