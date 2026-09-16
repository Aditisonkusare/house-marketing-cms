import { GraphQLError } from "graphql";
import type { GraphQLContext } from "@/lib/graphql/context";
import { requireAdmin } from "@/lib/graphql/resolvers/helpers";
import { sendCampaignEmails } from "@/lib/campaigns/sendCampaign";

type CampaignInput = {
  subject: string;
  body: string;
  newsPostId?: string | null;
};

export const campaignResolvers = {
  Query: {
    campaigns: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return ctx.prisma.campaign.findMany({
        include: { newsPost: true },
        orderBy: { createdAt: "desc" },
      });
    },
    campaign: (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return ctx.prisma.campaign.findUnique({
        where: { id: args.id },
        include: {
          newsPost: true,
          recipients: { include: { subscriber: true }, orderBy: { createdAt: "asc" } },
        },
      });
    },
    consentedSubscriberCount: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return ctx.prisma.subscriber.count({ where: { consent: true } });
    },
  },
  Mutation: {
    createCampaign: (_: unknown, args: { input: CampaignInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      const { subject, body, newsPostId } = args.input;
      return ctx.prisma.campaign.create({
        data: { subject, body, newsPostId: newsPostId || undefined },
        include: { newsPost: true },
      });
    },
    sendCampaign: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);

      const campaign = await ctx.prisma.campaign.findUnique({
        where: { id: args.id },
        include: { newsPost: true },
      });
      if (!campaign) {
        throw new GraphQLError("Campaign not found", { extensions: { code: "NOT_FOUND" } });
      }
      if (campaign.status !== "DRAFT") {
        throw new GraphQLError("This campaign has already been sent", {
          extensions: { code: "ALREADY_SENT" },
        });
      }

      const subscribers = await ctx.prisma.subscriber.findMany({ where: { consent: true } });
      if (subscribers.length === 0) {
        throw new GraphQLError("There are no consented subscribers to send to", {
          extensions: { code: "NO_RECIPIENTS" },
        });
      }

      // Lock in the audience at send-time, up front: a subscriber who
      // registers mid-send should not receive this campaign, and if the
      // process is interrupted partway through, the recipient rows still
      // show meaningful state (some SENT/FAILED, the rest PENDING) rather
      // than nothing. There's no automatic recovery for an interrupted
      // send in this synchronous design — an accepted limitation.
      await ctx.prisma.$transaction([
        ctx.prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: "SENDING", recipientCount: subscribers.length },
        }),
        ctx.prisma.campaignRecipient.createMany({
          data: subscribers.map((subscriber) => ({
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            status: "PENDING" as const,
          })),
          skipDuplicates: true,
        }),
      ]);

      const { failedCount } = await sendCampaignEmails({
        campaign,
        subscribers,
        prisma: ctx.prisma,
      });

      const finalStatus = failedCount === subscribers.length ? "FAILED" : "SENT";

      return ctx.prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: finalStatus, sentAt: new Date() },
        include: {
          newsPost: true,
          recipients: { include: { subscriber: true }, orderBy: { createdAt: "asc" } },
        },
      });
    },
  },
};
