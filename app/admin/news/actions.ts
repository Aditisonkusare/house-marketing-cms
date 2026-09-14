"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getGraphQLClient } from "@/lib/graphql-client";

const NEWS_POST_FIELDS = `
  id
  title
  slug
  body
  excerpt
  status
`;

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  status: "DRAFT" | "PUBLISHED";
};

export async function listNewsPosts() {
  const client = await getGraphQLClient();
  const data = await client.request<{ newsPosts: NewsPost[] }>(`
    query { newsPosts { ${NEWS_POST_FIELDS} } }
  `);
  return data.newsPosts;
}

export async function getNewsPost(id: string) {
  const posts = await listNewsPosts();
  return posts.find((p) => p.id === id) ?? null;
}

function inputFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title")),
    slug: String(formData.get("slug")),
    body: String(formData.get("body")),
    excerpt: String(formData.get("excerpt") ?? "") || null,
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  };
}

export async function createNewsPostAction(formData: FormData) {
  const client = await getGraphQLClient();
  await client.request(
    `mutation Create($input: NewsPostInput!) { createNewsPost(input: $input) { id } }`,
    { input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNewsPostAction(id: string, formData: FormData) {
  const client = await getGraphQLClient();
  await client.request(
    `mutation Update($id: ID!, $input: NewsPostInput!) { updateNewsPost(id: $id, input: $input) { id } }`,
    { id, input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNewsPostAction(id: string) {
  const client = await getGraphQLClient();
  await client.request(`mutation Delete($id: ID!) { deleteNewsPost(id: $id) }`, { id });
  revalidatePath("/admin/news");
}

export async function togglePublishAction(post: NewsPost) {
  const client = await getGraphQLClient();
  const nextStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  await client.request(
    `mutation Update($id: ID!, $input: NewsPostInput!) { updateNewsPost(id: $id, input: $input) { id } }`,
    {
      id: post.id,
      input: {
        title: post.title,
        slug: post.slug,
        body: post.body,
        excerpt: post.excerpt,
        status: nextStatus,
      },
    }
  );
  revalidatePath("/admin/news");
}
