import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";
import type { GraphQLContext } from "@/lib/graphql/context";

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  // Always render Apollo Sandbox at this route (dev and prod) - it doubles
  // as the interactive "docs page" for every query/mutation in this API.
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

const apolloHandler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
  context: async () => ({
    session: await getServerSession(authOptions),
    prisma,
  }),
});

// @as-integrations/next's returned handler type predates Next.js 16's stricter
// Route Handler typing, so it's wrapped here with an explicit compatible signature.
export async function GET(request: NextRequest) {
  return apolloHandler(request);
}

export async function POST(request: NextRequest) {
  return apolloHandler(request);
}
