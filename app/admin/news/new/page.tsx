import { createNewsPostAction } from "@/app/admin/news/actions";
import { NewsForm } from "@/app/admin/news/news-form";

export default function NewNewsPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">New Post</h1>
      <NewsForm action={createNewsPostAction} />
    </div>
  );
}
