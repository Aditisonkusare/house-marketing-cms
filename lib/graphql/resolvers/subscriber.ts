import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import type { GraphQLContext } from "@/lib/graphql/context";
import { registerSubscriberSchema } from "@/lib/validation/subscriber";

type RegisterSubscriberArgs = {
  input: {
    name: string;
    email: string;
    consent: boolean;
  };
};

export const subscriberResolvers = {
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
  },
};
