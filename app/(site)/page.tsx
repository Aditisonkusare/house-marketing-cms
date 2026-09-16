import Link from "next/link";
import { getPublicGraphQLClient } from "@/lib/graphql-client";
import { listPublishedHouseTypes } from "@/app/(site)/houses/queries";
import { listPublishedNewsPosts } from "@/app/(site)/news/queries";
import { HouseCard } from "@/components/house-card";
import { NewsCard } from "@/components/news-card";
import { ImageGallery } from "@/components/image-gallery";
import { RegisterCta } from "@/components/register-cta";

type HomeContent = {
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: string;
  introHeading?: string;
  introBody?: string;
  galleryImages?: string[];
};

async function getHomeContent(): Promise<HomeContent> {
  const client = await getPublicGraphQLClient();
  const data = await client.request<{ pageContent: { content: unknown } | null }>(
    `query { pageContent(slug: "home") { content } }`
  );
  const content = data.pageContent?.content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return content as HomeContent;
  }
  return {};
}

type ExtraPageContent = {
  slug: string;
  title: string | null;
  heading: string;
  body?: string;
};

// Any published Page Content besides "home" (used above for the hero/intro)
// renders as its own section on the homepage, so publishing/unpublishing a
// page content entry always has a visible effect on the live site — not
// just a change the API reports with nowhere to show it.
async function getExtraPageContents(): Promise<ExtraPageContent[]> {
  const client = await getPublicGraphQLClient();
  const data = await client.request<{
    pageContents: { slug: string; title: string | null; content: unknown }[];
  }>(`query { pageContents { slug title content } }`);

  return data.pageContents
    .filter((item) => item.slug !== "home")
    .map((item) => {
      const content =
        item.content && typeof item.content === "object" && !Array.isArray(item.content)
          ? (item.content as Record<string, unknown>)
          : {};
      const heading =
        typeof content.introHeading === "string"
          ? content.introHeading
          : item.title ?? item.slug;
      const body = typeof content.introBody === "string" ? content.introBody : undefined;
      return { slug: item.slug, title: item.title, heading, body };
    });
}

export default async function HomePage() {
  const [homeContent, extraPageContents, houseTypes, newsPosts] = await Promise.all([
    getHomeContent(),
    getExtraPageContents(),
    listPublishedHouseTypes(),
    listPublishedNewsPosts(),
  ]);

  const heroHeading = homeContent.heroHeading ?? "A new place to call home";
  const heroSubheading =
    homeContent.heroSubheading ??
    "Discover thoughtfully designed house types coming to this development.";
  const introHeading = homeContent.introHeading ?? "About this development";
  const introBody =
    homeContent.introBody ??
    'Content for this section is managed from the CMS. Add a Page Content entry with slug "home" to customise this introduction.';

  const galleryImages =
    homeContent.galleryImages && homeContent.galleryImages.length > 0
      ? homeContent.galleryImages
      : houseTypes.flatMap((houseType) => houseType.images).slice(0, 8);

  const featuredHouseTypes = houseTypes.slice(0, 3);
  const latestNews = newsPosts.slice(0, 3);

  return (
    <div>
      <section
        className="relative flex min-h-[420px] items-center bg-gray-900 bg-cover bg-center px-4 py-24 text-white sm:px-6"
        style={
          homeContent.heroImage
            ? {
                backgroundImage: `linear-gradient(rgba(17,24,39,0.55),rgba(17,24,39,0.55)), url("${homeContent.heroImage}")`,
              }
            : undefined
        }
      >
        <div className="mx-auto max-w-3xl text-center sm:text-left">
          <h1 className="text-3xl font-bold sm:text-5xl">{heroHeading}</h1>
          <p className="mt-4 text-lg text-gray-200">{heroSubheading}</p>
          <Link
            href="/houses"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            View house types
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{introHeading}</h2>
        <p className="mt-4 whitespace-pre-wrap text-gray-600 dark:text-gray-400">{introBody}</p>
      </section>

      {extraPageContents.map((item) => (
        <section key={item.slug} className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{item.heading}</h2>
          {item.body && (
            <p className="mt-4 whitespace-pre-wrap text-gray-600 dark:text-gray-400">{item.body}</p>
          )}
        </section>
      ))}

      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">Gallery</h2>
          <ImageGallery images={galleryImages} alt="Development gallery" />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Featured house types</h2>
          <Link
            href="/houses"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            View all
          </Link>
        </div>
        {featuredHouseTypes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredHouseTypes.map((houseType) => (
              <HouseCard key={houseType.id} houseType={houseType} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">House types are coming soon — check back shortly.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Latest updates</h2>
          <Link
            href="/news"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            View all
          </Link>
        </div>
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((newsPost) => (
              <NewsCard key={newsPost.id} newsPost={newsPost} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No news yet — check back shortly.</p>
        )}
      </section>

      <RegisterCta />
    </div>
  );
}
