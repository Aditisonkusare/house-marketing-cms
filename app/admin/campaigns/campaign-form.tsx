"use client";

type NewsPostOption = { id: string; title: string };

export function CampaignForm({
  action,
  newsPosts,
}: {
  action: (formData: FormData) => void;
  newsPosts: NewsPostOption[];
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <Field label="Subject">
        <input name="subject" required className="input" />
      </Field>
      <Field label="Body">
        <textarea name="body" required className="input" rows={8} />
      </Field>
      <Field label="Link to a news post (optional)">
        <select name="newsPostId" defaultValue="" className="input">
          <option value="">— None —</option>
          {newsPosts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900"
      >
        Save Draft
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
