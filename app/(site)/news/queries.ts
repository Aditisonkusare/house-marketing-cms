import { getGraphQLClient } from "@/lib/graphql-client";

const NEWS_POST_FIELDS = `
  id
  title
  slug
  body
  excerpt
  publishedAt
`;

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  publishedAt: string | null;
};

function byPublishedAtDesc(a: NewsPost, b: NewsPost) {
  if (!a.publishedAt) return 1;
  if (!b.publishedAt) return -1;
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function listPublishedNewsPosts() {
  const client = await getGraphQLClient();
  const data = await client.request<{ newsPosts: NewsPost[] }>(`
    query { newsPosts { ${NEWS_POST_FIELDS} } }
  `);
  return [...data.newsPosts].sort(byPublishedAtDesc);
}

export async function getNewsPostBySlug(slug: string) {
  const client = await getGraphQLClient();
  const data = await client.request<{ newsPost: NewsPost | null }>(
    `query NewsPost($slug: String!) { newsPost(slug: $slug) { ${NEWS_POST_FIELDS} } }`,
    { slug }
  );
  return data.newsPost;
}
