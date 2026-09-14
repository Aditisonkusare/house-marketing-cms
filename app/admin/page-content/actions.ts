"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getGraphQLClient } from "@/lib/graphql-client";

const PAGE_CONTENT_FIELDS = `
  id
  slug
  title
  content
  status
`;

export type PageContent = {
  id: string;
  slug: string;
  title: string | null;
  content: unknown;
  status: "DRAFT" | "PUBLISHED";
};

export async function listPageContents() {
  const client = await getGraphQLClient();
  const data = await client.request<{ pageContents: PageContent[] }>(`
    query { pageContents { ${PAGE_CONTENT_FIELDS} } }
  `);
  return data.pageContents;
}

export async function getPageContent(id: string) {
  const items = await listPageContents();
  return items.find((p) => p.id === id) ?? null;
}

function inputFromFormData(formData: FormData) {
  let content: unknown;
  try {
    content = JSON.parse(String(formData.get("content") ?? "{}"));
  } catch {
    throw new Error("Content must be valid JSON");
  }

  return {
    slug: String(formData.get("slug")),
    title: String(formData.get("title") ?? "") || null,
    content,
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  };
}

export async function createPageContentAction(formData: FormData) {
  const client = await getGraphQLClient();
  await client.request(
    `mutation Create($input: PageContentInput!) { createPageContent(input: $input) { id } }`,
    { input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/page-content");
  redirect("/admin/page-content");
}

export async function updatePageContentAction(id: string, formData: FormData) {
  const client = await getGraphQLClient();
  await client.request(
    `mutation Update($id: ID!, $input: PageContentInput!) { updatePageContent(id: $id, input: $input) { id } }`,
    { id, input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/page-content");
  redirect("/admin/page-content");
}

export async function deletePageContentAction(id: string) {
  const client = await getGraphQLClient();
  await client.request(`mutation Delete($id: ID!) { deletePageContent(id: $id) }`, { id });
  revalidatePath("/admin/page-content");
}

export async function togglePublishAction(item: PageContent) {
  const client = await getGraphQLClient();
  const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  await client.request(
    `mutation Update($id: ID!, $input: PageContentInput!) { updatePageContent(id: $id, input: $input) { id } }`,
    {
      id: item.id,
      input: {
        slug: item.slug,
        title: item.title,
        content: item.content,
        status: nextStatus,
      },
    }
  );
  revalidatePath("/admin/page-content");
}
