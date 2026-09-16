"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getGraphQLClient } from "@/lib/graphql-client";

const CAMPAIGN_FIELDS = `
  id
  subject
  body
  status
  sentAt
  recipientCount
  createdAt
  newsPost { id title slug }
`;

const CAMPAIGN_DETAIL_FIELDS = `
  ${CAMPAIGN_FIELDS}
  recipients {
    id
    status
    sentAt
    error
    subscriber { id name email }
  }
`;

export type CampaignStatus = "DRAFT" | "SENDING" | "SENT" | "FAILED";

export type CampaignSummary = {
  id: string;
  subject: string;
  body: string;
  status: CampaignStatus;
  sentAt: string | null;
  recipientCount: number;
  createdAt: string;
  newsPost: { id: string; title: string; slug: string } | null;
};

export type CampaignRecipient = {
  id: string;
  status: "PENDING" | "SENT" | "FAILED";
  sentAt: string | null;
  error: string | null;
  subscriber: { id: string; name: string; email: string };
};

export type CampaignDetail = CampaignSummary & {
  recipients: CampaignRecipient[];
};

export async function listCampaigns() {
  const client = await getGraphQLClient();
  const data = await client.request<{ campaigns: CampaignSummary[] }>(`
    query { campaigns { ${CAMPAIGN_FIELDS} } }
  `);
  return data.campaigns;
}

export async function getCampaign(id: string) {
  const client = await getGraphQLClient();
  const data = await client.request<{ campaign: CampaignDetail | null }>(
    `query Campaign($id: ID!) { campaign(id: $id) { ${CAMPAIGN_DETAIL_FIELDS} } }`,
    { id }
  );
  return data.campaign;
}

export async function getConsentedSubscriberCount() {
  const client = await getGraphQLClient();
  const data = await client.request<{ consentedSubscriberCount: number }>(
    `query { consentedSubscriberCount }`
  );
  return data.consentedSubscriberCount;
}

export async function listPublishedNewsPostsForDropdown() {
  const client = await getGraphQLClient();
  const data = await client.request<{
    newsPosts: { id: string; title: string; status: "DRAFT" | "PUBLISHED" }[];
  }>(`query { newsPosts { id title status } }`);
  return data.newsPosts.filter((post) => post.status === "PUBLISHED");
}

function inputFromFormData(formData: FormData) {
  const newsPostId = String(formData.get("newsPostId") ?? "");
  return {
    subject: String(formData.get("subject")),
    body: String(formData.get("body")),
    newsPostId: newsPostId || null,
  };
}

export async function createCampaignAction(formData: FormData) {
  const client = await getGraphQLClient();
  const data = await client.request<{ createCampaign: { id: string } }>(
    `mutation Create($input: CampaignInput!) { createCampaign(input: $input) { id } }`,
    { input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/campaigns");
  redirect(`/admin/campaigns/${data.createCampaign.id}`);
}

export async function sendCampaignAction(id: string) {
  const client = await getGraphQLClient();
  await client.request(`mutation Send($id: ID!) { sendCampaign(id: $id) { id } }`, { id });
  revalidatePath("/admin/campaigns");
  revalidatePath(`/admin/campaigns/${id}`);
}
