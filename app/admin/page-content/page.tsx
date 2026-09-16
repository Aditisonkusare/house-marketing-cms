import Link from "next/link";
import {
  listPageContents,
  deletePageContentAction,
  togglePublishAction,
} from "@/app/admin/page-content/actions";

export default async function PageContentPage() {
  const items = await listPageContents();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Page Content</h1>
        <Link
          href="/admin/page-content/new"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900"
        >
          New Page Content
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="py-2">Slug</th>
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2">{item.slug}</td>
              <td className="py-2">{item.title}</td>
              <td className="py-2">
                <span
                  className={
                    item.status === "PUBLISHED"
                      ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="space-x-3 py-2">
                <Link
                  href={`/admin/page-content/${item.id}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Edit
                </Link>
                <form action={togglePublishAction.bind(null, item)} className="inline">
                  <button type="submit" className="text-gray-600 hover:underline dark:text-gray-400">
                    {item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deletePageContentAction.bind(null, item.id)} className="inline">
                  <button type="submit" className="text-red-600 hover:underline dark:text-red-400">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-400 dark:text-gray-500">
                No page content yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
