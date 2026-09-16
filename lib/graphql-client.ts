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

/**
 * A GraphQL client for use from the public site's Server Components/Actions.
 * Never forwards the visitor's cookies, so the GraphQL API always treats the
 * request as anonymous — even if the browser happens to also carry a valid
 * admin session (e.g. someone previewing the public site while signed into
 * /admin in the same tab). This guarantees draft content never renders on
 * public pages regardless of who is viewing them.
 */
export async function getPublicGraphQLClient() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXTAUTH_URL ?? `${protocol}://${host}`;

  return new GraphQLClient(`${baseUrl}/api/graphql`);
}
