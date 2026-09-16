import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/app/(site)/news/queries";

export function NewsCard({ newsPost }: { newsPost: NewsPost }) {
  return (
    <Link
      href={`/news/${newsPost.slug}`}
      className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 transition hover:shadow-md"
    >
      {newsPost.publishedAt && (
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {formatDate(newsPost.publishedAt)}
        </p>
      )}
      <h3 className="font-semibold text-gray-900">{newsPost.title}</h3>
      {newsPost.excerpt && <p className="text-sm text-gray-500">{newsPost.excerpt}</p>}
    </Link>
  );
}
