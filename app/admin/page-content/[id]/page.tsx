import { notFound } from "next/navigation";
import { getPageContent, updatePageContentAction } from "@/app/admin/page-content/actions";
import { PageContentForm } from "@/app/admin/page-content/page-content-form";

export default async function EditPageContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPageContent(id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Page Content</h1>
      <PageContentForm action={updatePageContentAction.bind(null, id)} defaultValues={item} />
    </div>
  );
}
