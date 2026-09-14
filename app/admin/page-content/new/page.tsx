import { createPageContentAction } from "@/app/admin/page-content/actions";
import { PageContentForm } from "@/app/admin/page-content/page-content-form";

export default function NewPageContentPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">New Page Content</h1>
      <PageContentForm action={createPageContentAction} />
    </div>
  );
}
