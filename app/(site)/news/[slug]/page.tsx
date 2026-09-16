import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsPostBySlug } from "@/app/(site)/news/queries";
import { formatDate } from "@/lib/format";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const newsPost = await getNewsPostBySlug(slug);
  if (!newsPost) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/news" className="text-sm font-medium text-gray-500 hover:text-gray-900">
        &larr; Back to news
      </Link>

      {newsPost.publishedAt && (
        <p className="mt-4 text-xs uppercase tracking-wide text-gray-400">
          {formatDate(newsPost.publishedAt)}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold text-gray-900">{newsPost.title}</h1>

      <div className="mt-6 whitespace-pre-wrap text-gray-700">{newsPost.body}</div>

      <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-gray-700">Don&apos;t miss the next update.</p>
        <Link
          href="/register"
          className="mt-3 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Register for updates
        </Link>
      </div>
    </div>
  );
}
