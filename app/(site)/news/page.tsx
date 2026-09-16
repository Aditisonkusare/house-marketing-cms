import { listPublishedNewsPosts } from "@/app/(site)/news/queries";
import { NewsCard } from "@/components/news-card";

export const metadata = {
  title: "News | Glenveagh Homes",
};

export default async function NewsPage() {
  const newsPosts = await listPublishedNewsPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">News &amp; Updates</h1>
      <p className="mt-2 text-gray-600">The latest news from this development.</p>

      {newsPosts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsPosts.map((newsPost) => (
            <NewsCard key={newsPost.id} newsPost={newsPost} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">No updates yet — check back shortly.</p>
      )}
    </div>
  );
}
