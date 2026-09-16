"use client";

import type { HouseType } from "@/app/admin/house-types/actions";

export function HouseTypeForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: HouseType;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <Field label="Name">
        <input name="name" required defaultValue={defaultValues?.name} className="input" />
      </Field>
      <Field label="Slug">
        <input name="slug" required defaultValue={defaultValues?.slug} className="input" />
      </Field>
      <Field label="Description">
        <textarea name="description" defaultValue={defaultValues?.description ?? ""} className="input" rows={3} />
      </Field>
      <Field label="Image URLs (one per line)">
        <textarea
          name="images"
          defaultValue={defaultValues?.images.join("\n")}
          className="input"
          rows={3}
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Price From (€)">
          <input
            type="number"
            step="0.01"
            name="priceFrom"
            required
            defaultValue={defaultValues?.priceFrom}
            className="input"
          />
        </Field>
        <Field label="Bedrooms">
          <input type="number" name="bedrooms" required defaultValue={defaultValues?.bedrooms} className="input" />
        </Field>
        <Field label="Bathrooms">
          <input
            type="number"
            name="bathrooms"
            required
            defaultValue={defaultValues?.bathrooms}
            className="input"
          />
        </Field>
      </div>
      <Field label="Floor Area (sqm)">
        <input
          type="number"
          step="0.01"
          name="floorAreaSqm"
          required
          defaultValue={defaultValues?.floorAreaSqm}
          className="input"
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
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900"
      >
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
