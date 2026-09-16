import { notFound } from "next/navigation";
import {
  getCampaign,
  getConsentedSubscriberCount,
  sendCampaignAction,
} from "@/app/admin/campaigns/actions";
import { renderCampaignEmailHtml } from "@/lib/campaigns/email-template";
import { formatDate } from "@/lib/format";

const RECIPIENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  SENT: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const isDraft = campaign.status === "DRAFT";
  const consentedCount = isDraft ? await getConsentedSubscriberCount() : null;

  const previewHtml = renderCampaignEmailHtml({
    subject: campaign.subject,
    body: campaign.body,
    newsPostLink: campaign.newsPost ? `#preview-news-post-${campaign.newsPost.slug}` : undefined,
    unsubscribeUrl: "#preview-unsubscribe-link",
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{campaign.subject}</h1>
        {campaign.newsPost && (
          <p className="mt-1 text-sm text-gray-500">Linked to news post: {campaign.newsPost.title}</p>
        )}
      </div>

      {isDraft ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            Will be sent to <strong>{consentedCount}</strong> consented subscriber
            {consentedCount === 1 ? "" : "s"}.
          </p>
          <form action={sendCampaignAction.bind(null, campaign.id)} className="mt-3">
            <button
              type="submit"
              disabled={consentedCount === 0}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send Campaign
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          Sent {campaign.sentAt ? formatDate(campaign.sentAt) : ""} to {campaign.recipientCount}{" "}
          subscriber{campaign.recipientCount === 1 ? "" : "s"} — status: {campaign.status}
        </div>
      )}

      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Preview</h2>
        <iframe
          srcDoc={previewHtml}
          sandbox=""
          className="h-[420px] w-full rounded-md border border-gray-200"
          title="Email preview"
        />
      </div>

      {campaign.recipients.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Recipient log</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2">Subscriber</th>
                <th className="py-2">Status</th>
                <th className="py-2">Sent</th>
                <th className="py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {campaign.recipients.map((recipient) => (
                <tr key={recipient.id} className="border-b border-gray-100">
                  <td className="py-2">
                    {recipient.subscriber.name} &lt;{recipient.subscriber.email}&gt;
                  </td>
                  <td className="py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${RECIPIENT_STATUS_STYLES[recipient.status]}`}
                    >
                      {recipient.status}
                    </span>
                  </td>
                  <td className="py-2">{recipient.sentAt ? formatDate(recipient.sentAt) : "—"}</td>
                  <td className="py-2 text-red-600">{recipient.error ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
