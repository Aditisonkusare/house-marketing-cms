import Link from "next/link";
import { listNewsPosts, deleteNewsPostAction, togglePublishAction } from "@/app/admin/news/actions";

export default async function NewsPage() {
  const posts = await listNewsPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">News</h1>
        <Link href="/admin/news/new" className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white">
          New Post
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-gray-100">
              <td className="py-2">{post.title}</td>
              <td className="py-2">
                <span
                  className={
                    post.status === "PUBLISHED"
                      ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-800"
                      : "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  }
                >
                  {post.status}
                </span>
              </td>
              <td className="space-x-3 py-2">
                <Link href={`/admin/news/${post.id}`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <form action={togglePublishAction.bind(null, post)} className="inline">
                  <button type="submit" className="text-gray-600 hover:underline">
                    {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteNewsPostAction.bind(null, post.id)} className="inline">
                  <button type="submit" className="text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-gray-400">
                No news posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
