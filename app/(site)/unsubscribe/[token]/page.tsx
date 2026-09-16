import { getPublicGraphQLClient } from "@/lib/graphql-client";

export const metadata = {
  title: "Unsubscribe | Glenveagh Homes",
};

// A plain GET link is intentional here: it's what a "click to unsubscribe"
// link in an email client actually does. The mutation is idempotent (an
// already-unsubscribed or unknown token is a harmless no-op), so a link
// scanner pre-fetching this URL can't cause any unwanted side effect.
export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await getPublicGraphQLClient();
  const data = await client.request<{ unsubscribe: boolean }>(
    `mutation Unsubscribe($token: String!) { unsubscribe(token: $token) }`,
    { token }
  );

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      {data.unsubscribe ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            You&rsquo;ve been unsubscribed
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            You won&rsquo;t receive any further email updates from Glenveagh Homes. If this was a
            mistake, you can register again at any time.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Link no longer valid</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            This unsubscribe link isn&rsquo;t recognized. If you&rsquo;re still receiving emails
            you&rsquo;d like to stop, please get in touch.
          </p>
        </>
      )}
    </div>
  );
}
