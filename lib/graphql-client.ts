import { GraphQLClient } from "graphql-request";
import { headers } from "next/headers";

/**
 * A GraphQL client for use from Server Components / Server Actions that
 * forwards the incoming request's session cookie, so the GraphQL API sees
 * the same authenticated (or anonymous) session as the page itself.
 */
export async function getGraphQLClient() {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXTAUTH_URL ?? `${protocol}://${host}`;

  return new GraphQLClient(`${baseUrl}/api/graphql`, {
    headers: { cookie },
  });
}
