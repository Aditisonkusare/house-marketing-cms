import { getPublicGraphQLClient } from "@/lib/graphql-client";

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
`;

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
};

export async function listPublishedHouseTypes() {
  const client = await getPublicGraphQLClient();
  const data = await client.request<{ houseTypes: HouseType[] }>(`
    query { houseTypes { ${HOUSE_TYPE_FIELDS} } }
  `);
  return data.houseTypes;
}

export async function getHouseTypeBySlug(slug: string) {
  const client = await getPublicGraphQLClient();
  const data = await client.request<{ houseType: HouseType | null }>(
    `query HouseType($slug: String!) { houseType(slug: $slug) { ${HOUSE_TYPE_FIELDS} } }`,
    { slug }
  );
  return data.houseType;
}
