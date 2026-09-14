"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getGraphQLClient } from "@/lib/graphql-client";

const HOUSE_TYPE_FIELDS = `
  id
  name
  slug
  description
  images
  priceFrom
  bedrooms
  bathrooms
  floorAreaSqm
  status
`;

export async function listHouseTypes() {
  const client = await getGraphQLClient();
  const data = await client.request<{ houseTypes: HouseType[] }>(`
    query { houseTypes { ${HOUSE_TYPE_FIELDS} } }
  `);
  return data.houseTypes;
}

export async function getHouseType(id: string) {
  const houseTypes = await listHouseTypes();
  return houseTypes.find((h) => h.id === id) ?? null;
}

export type HouseType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[];
  priceFrom: number;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqm: number;
  status: "DRAFT" | "PUBLISHED";
};

function inputFromFormData(formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name: String(formData.get("name")),
    slug: String(formData.get("slug")),
    description: String(formData.get("description") ?? "") || null,
    images,
    priceFrom: Number(formData.get("priceFrom")),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    floorAreaSqm: Number(formData.get("floorAreaSqm")),
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  };
}

export async function createHouseTypeAction(formData: FormData) {
  const client = await getGraphQLClient();
  await client.request(
    `mutation Create($input: HouseTypeInput!) { createHouseType(input: $input) { id } }`,
    { input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/house-types");
  redirect("/admin/house-types");
}

export async function updateHouseTypeAction(id: string, formData: FormData) {
  const client = await getGraphQLClient();
  await client.request(
    `mutation Update($id: ID!, $input: HouseTypeInput!) { updateHouseType(id: $id, input: $input) { id } }`,
    { id, input: inputFromFormData(formData) }
  );
  revalidatePath("/admin/house-types");
  redirect("/admin/house-types");
}

export async function deleteHouseTypeAction(id: string) {
  const client = await getGraphQLClient();
  await client.request(`mutation Delete($id: ID!) { deleteHouseType(id: $id) }`, { id });
  revalidatePath("/admin/house-types");
}

export async function togglePublishAction(houseType: HouseType) {
  const client = await getGraphQLClient();
  const nextStatus = houseType.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  await client.request(
    `mutation Update($id: ID!, $input: HouseTypeInput!) { updateHouseType(id: $id, input: $input) { id } }`,
    {
      id: houseType.id,
      input: {
        name: houseType.name,
        slug: houseType.slug,
        description: houseType.description,
        images: houseType.images,
        priceFrom: houseType.priceFrom,
        bedrooms: houseType.bedrooms,
        bathrooms: houseType.bathrooms,
        floorAreaSqm: houseType.floorAreaSqm,
        status: nextStatus,
      },
    }
  );
  revalidatePath("/admin/house-types");
}
