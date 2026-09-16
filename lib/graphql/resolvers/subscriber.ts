import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import type { GraphQLContext } from "@/lib/graphql/context";
import { registerSubscriberSchema } from "@/lib/validation/subscriber";
import { requireAdmin } from "@/lib/graphql/resolvers/helpers";

type RegisterSubscriberArgs = {
  input: {
    name: string;
    email: string;
    consent: boolean;
  };
};

export const subscriberResolvers = {
  Query: {
    subscribers: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return ctx.prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } });
    },
  },
  Mutation: {
    registerSubscriber: async (_: unknown, args: RegisterSubscriberArgs, ctx: GraphQLContext) => {
      const result = registerSubscriberSchema.safeParse(args.input);
      if (!result.success) {
        throw new GraphQLError("Invalid subscriber details", {
          extensions: {
            code: "BAD_USER_INPUT",
            fieldErrors: result.error.flatten().fieldErrors,
          },
        });
      }

      const { name, email, consent } = result.data;

      try {
        return await ctx.prisma.subscriber.create({ data: { name, email, consent } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          throw new GraphQLError("This email is already registered", {
            extensions: { code: "DUPLICATE_EMAIL" },
          });
        }
        throw error;
      }
    },

    // Public and idempotent: a link clicked from an email, not an admin action.
    // Returns false only when the token doesn't match any subscriber.
    unsubscribe: async (_: unknown, args: { token: string }, ctx: GraphQLContext) => {
      const subscriber = await ctx.prisma.subscriber.findUnique({
        where: { unsubscribeToken: args.token },
      });
      if (!subscriber) return false;
      if (!subscriber.consent) return true;

      await ctx.prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { consent: false, unsubscribedAt: new Date() },
      });
      return true;
    },
  },
};
