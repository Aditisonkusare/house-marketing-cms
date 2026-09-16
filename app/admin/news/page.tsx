import Link from "next/link";
import { listNewsPosts, deleteNewsPostAction, togglePublishAction } from "@/app/admin/news/actions";

export default async function NewsPage() {
  const posts = await listNewsPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">News</h1>
        <Link
          href="/admin/news/new"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900"
        >
          New Post
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2">{post.title}</td>
              <td className="py-2">
                <span
                  className={
                    post.status === "PUBLISHED"
                      ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }
                >
                  {post.status}
                </span>
              </td>
              <td className="space-x-3 py-2">
                <Link href={`/admin/news/${post.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                  Edit
                </Link>
                <form action={togglePublishAction.bind(null, post)} className="inline">
                  <button type="submit" className="text-gray-600 hover:underline dark:text-gray-400">
                    {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteNewsPostAction.bind(null, post.id)} className="inline">
                  <button type="submit" className="text-red-600 hover:underline dark:text-red-400">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-gray-400 dark:text-gray-500">
                No news posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
