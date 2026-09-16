import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { PrismaClient, Campaign, NewsPost, Subscriber } from "@prisma/client";
import { sendCampaignEmails } from "@/lib/campaigns/sendCampaign";

function makeSubscriber(overrides: Partial<Subscriber> = {}): Subscriber {
  return {
    id: "sub-1",
    name: "Test Subscriber",
    email: "test@example.com",
    consent: true,
    unsubscribeToken: "token-1",
    subscribedAt: new Date(),
    unsubscribedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Subscriber;
}

function makeCampaign(
  overrides: Partial<Campaign> & { newsPost?: NewsPost | null } = {}
): Campaign & { newsPost: NewsPost | null } {
  return {
    id: "camp-1",
    subject: "Test subject",
    body: "Test body",
    newsPostId: null,
    status: "SENDING",
    sentAt: null,
    recipientCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    newsPost: null,
    ...overrides,
  } as Campaign & { newsPost: NewsPost | null };
}

function makePrisma() {
  const update = vi.fn().mockResolvedValue({});
  const prisma = { campaignRecipient: { update } } as unknown as PrismaClient;
  return { prisma, update };
}

describe("sendCampaignEmails", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_URL", "https://example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws instead of silently defaulting to localhost when NEXTAUTH_URL is unset", async () => {
    vi.stubEnv("NEXTAUTH_URL", "");
    const { prisma } = makePrisma();
    const sendMail = vi.fn().mockResolvedValue(undefined);

    await expect(
      sendCampaignEmails({ campaign: makeCampaign(), subscribers: [makeSubscriber()], prisma, sendMail })
    ).rejects.toThrow("NEXTAUTH_URL must be set");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("marks every recipient SENT when delivery succeeds", async () => {
    const { prisma, update } = makePrisma();
    const sendMail = vi.fn().mockResolvedValue(undefined);
    const subscribers = [
      makeSubscriber({ id: "a", email: "a@example.com" }),
      makeSubscriber({ id: "b", email: "b@example.com" }),
    ];

    const result = await sendCampaignEmails({ campaign: makeCampaign(), subscribers, prisma, sendMail });

    expect(result).toEqual({ sentCount: 2, failedCount: 0 });
    expect(sendMail).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { campaignId_subscriberId: { campaignId: "camp-1", subscriberId: "a" } },
        data: expect.objectContaining({ status: "SENT" }),
      })
    );
  });

  it("marks a failed delivery as FAILED with the error message, without stopping the rest of the send", async () => {
    const { prisma, update } = makePrisma();
    const sendMail = vi
      .fn()
      .mockRejectedValueOnce(new Error("SMTP connection refused"))
      .mockResolvedValueOnce(undefined);
    const subscribers = [
      makeSubscriber({ id: "a", email: "a@example.com" }),
      makeSubscriber({ id: "b", email: "b@example.com" }),
    ];

    const result = await sendCampaignEmails({ campaign: makeCampaign(), subscribers, prisma, sendMail });

    expect(result).toEqual({ sentCount: 1, failedCount: 1 });
    expect(sendMail).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { campaignId_subscriberId: { campaignId: "camp-1", subscriberId: "a" } },
        data: expect.objectContaining({ status: "FAILED", error: "SMTP connection refused" }),
      })
    );
    expect(update).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { campaignId_subscriberId: { campaignId: "camp-1", subscriberId: "b" } },
        data: expect.objectContaining({ status: "SENT" }),
      })
    );
  });

  it("gives each subscriber a working unsubscribe link unique to their own token", async () => {
    const { prisma } = makePrisma();
    const sendMail = vi.fn().mockResolvedValue(undefined);
    const subscriber = makeSubscriber({ unsubscribeToken: "unique-token-123" });

    await sendCampaignEmails({ campaign: makeCampaign(), subscribers: [subscriber], prisma, sendMail });

    const [call] = sendMail.mock.calls[0];
    expect(call.html).toContain("/unsubscribe/unique-token-123");
  });

  it("includes a link to the linked news post when the campaign has one", async () => {
    const { prisma } = makePrisma();
    const sendMail = vi.fn().mockResolvedValue(undefined);
    const campaign = makeCampaign({ newsPost: { slug: "phase-2-now-selling" } as NewsPost });

    await sendCampaignEmails({ campaign, subscribers: [makeSubscriber()], prisma, sendMail });

    const [call] = sendMail.mock.calls[0];
    expect(call.html).toContain("/news/phase-2-now-selling");
  });

  it("omits the news post link entirely when the campaign has no linked post", async () => {
    const { prisma } = makePrisma();
    const sendMail = vi.fn().mockResolvedValue(undefined);

    await sendCampaignEmails({
      campaign: makeCampaign({ newsPost: null }),
      subscribers: [makeSubscriber()],
      prisma,
      sendMail,
    });

    const [call] = sendMail.mock.calls[0];
    expect(call.html).not.toContain("Read more");
  });
});
