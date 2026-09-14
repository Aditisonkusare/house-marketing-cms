import { notFound } from "next/navigation";
import { getNewsPost, updateNewsPostAction } from "@/app/admin/news/actions";
import { NewsForm } from "@/app/admin/news/news-form";

export default async function EditNewsPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getNewsPost(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Edit Post</h1>
      <NewsForm action={updateNewsPostAction.bind(null, id)} defaultValues={post} />
    </div>
  );
}
