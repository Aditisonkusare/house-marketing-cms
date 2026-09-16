import Link from "next/link";
import { listCampaigns } from "@/app/admin/campaigns/actions";
import { formatDate } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SENDING: "bg-yellow-100 text-yellow-800",
  SENT: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>
        <Link
          href="/admin/campaigns/new"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          New Campaign
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Subject</th>
            <th className="py-2">Status</th>
            <th className="py-2">Recipients</th>
            <th className="py-2">Sent</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b border-gray-100">
              <td className="py-2">{campaign.subject}</td>
              <td className="py-2">
                <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLES[campaign.status]}`}>
                  {campaign.status}
                </span>
              </td>
              <td className="py-2">{campaign.recipientCount}</td>
              <td className="py-2">{campaign.sentAt ? formatDate(campaign.sentAt) : "—"}</td>
              <td className="py-2">
                <Link href={`/admin/campaigns/${campaign.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
          {campaigns.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                No campaigns yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
