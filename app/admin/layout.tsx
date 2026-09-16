import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/app/admin/sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // The login page itself is exempt from middleware protection, and has no session-dependent chrome.
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Glenveagh CMS
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="/admin/page-content"
              className="block rounded px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Page Content
            </Link>
          </li>
          <li>
            <Link
              href="/admin/house-types"
              className="block rounded px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              House Types
            </Link>
          </li>
          <li>
            <Link
              href="/admin/news"
              className="block rounded px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              News
            </Link>
          </li>
          <li>
            <Link
              href="/admin/campaigns"
              className="block rounded px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Campaigns
            </Link>
          </li>
          <li>
            <Link
              href="/admin/subscribers"
              className="block rounded px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Subscribers
            </Link>
          </li>
        </ul>
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="mb-2 truncate text-xs text-gray-500 dark:text-gray-400">{session.user.email}</p>
          <SignOutButton />
        </div>
      </nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
