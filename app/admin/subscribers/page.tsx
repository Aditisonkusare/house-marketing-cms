import { getGraphQLClient } from "@/lib/graphql-client";
import { formatDate } from "@/lib/format";

type Subscriber = {
  id: string;
  name: string;
  email: string;
  consent: boolean;
  subscribedAt: string;
};

async function listSubscribers() {
  const client = await getGraphQLClient();
  const data = await client.request<{ subscribers: Subscriber[] }>(`
    query { subscribers { id name email consent subscribedAt } }
  `);
  return data.subscribers;
}

export default async function SubscribersPage() {
  const subscribers = await listSubscribers();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Subscribers</h1>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Consent</th>
            <th className="py-2">Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2">{subscriber.name}</td>
              <td className="py-2">{subscriber.email}</td>
              <td className="py-2">
                <span
                  className={
                    subscriber.consent
                      ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }
                >
                  {subscriber.consent ? "Yes" : "No"}
                </span>
              </td>
              <td className="py-2">{formatDate(subscriber.subscribedAt)}</td>
            </tr>
          ))}
          {subscribers.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-400 dark:text-gray-500">
                No subscribers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
