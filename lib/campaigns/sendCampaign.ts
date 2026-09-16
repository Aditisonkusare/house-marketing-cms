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
  let sentCount = 0;
  let failedCount = 0;

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const newsPostLink = campaign.newsPost ? `${baseUrl}/news/${campaign.newsPost.slug}` : undefined;

  for (const subscriber of subscribers) {
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
      sentCount++;
    } catch (error) {
      await prisma.campaignRecipient.update({
        where: { campaignId_subscriberId: { campaignId: campaign.id, subscriberId: subscriber.id } },
        data: { status: "FAILED", error: error instanceof Error ? error.message : String(error) },
      });
      failedCount++;
    }
  }

  return { sentCount, failedCount };
}
