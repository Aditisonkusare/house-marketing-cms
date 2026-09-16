import type { PrismaClient, Campaign, NewsPost, Subscriber } from "@prisma/client";
import { renderCampaignEmailHtml } from "@/lib/campaigns/email-template";
import { sendMail as defaultSendMail } from "@/lib/mailer";

type CampaignWithNewsPost = Campaign & { newsPost: NewsPost | null };

/**
 * Framework-agnostic campaign send loop: no GraphQL/Next.js imports, so it
 * can be unit-tested (fake sendMail/prisma) or moved into a background
 * queue later without rewriting it.
 */
export async function sendCampaignEmails({
  campaign,
  subscribers,
  prisma,
  sendMail = defaultSendMail,
}: {
  campaign: CampaignWithNewsPost;
  subscribers: Subscriber[];
  prisma: PrismaClient;
  sendMail?: typeof defaultSendMail;
}) {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    // No silent localhost fallback: a wrong base URL means real recipients get
    // broken unsubscribe/news links in an email that's already been sent.
    throw new Error("NEXTAUTH_URL must be set to send a campaign (used for unsubscribe/news links)");
  }
  const newsPostLink = campaign.newsPost ? `${baseUrl}/news/${campaign.newsPost.slug}` : undefined;

  // Sent concurrently, not one-at-a-time: a sequential loop's total time is
  // the SUM of every recipient's SMTP round-trip, which risks tripping a
  // serverless function's execution timeout once there's more than a
  // handful of subscribers. Each recipient's own try/catch still isolates
  // its failure from the rest, exactly as the sequential version did.
  const results = await Promise.all(
    subscribers.map(async (subscriber) => {
      const unsubscribeUrl = `${baseUrl}/unsubscribe/${subscriber.unsubscribeToken}`;
      const html = renderCampaignEmailHtml({
        subject: campaign.subject,
        body: campaign.body,
        newsPostLink,
        unsubscribeUrl,
      });

      try {
        await sendMail({ to: subscriber.email, subject: campaign.subject, html });
        await prisma.campaignRecipient.update({
          where: { campaignId_subscriberId: { campaignId: campaign.id, subscriberId: subscriber.id } },
          data: { status: "SENT", sentAt: new Date() },
        });
        return true;
      } catch (error) {
        await prisma.campaignRecipient.update({
          where: { campaignId_subscriberId: { campaignId: campaign.id, subscriberId: subscriber.id } },
          data: { status: "FAILED", error: error instanceof Error ? error.message : String(error) },
        });
        return false;
      }
    })
  );

  const sentCount = results.filter(Boolean).length;
  const failedCount = results.length - sentCount;

  return { sentCount, failedCount };
}
