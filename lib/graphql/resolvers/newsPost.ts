import type { GraphQLContext } from "@/lib/graphql/context";
import { requireAdmin, visibilityWhere } from "@/lib/graphql/resolvers/helpers";

type NewsPostInput = {
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  status?: "DRAFT" | "PUBLISHED";
};

export const newsPostResolvers = {
  Query: {
    newsPosts: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.prisma.newsPost.findMany({
        where: { ...visibilityWhere(ctx.session) },
        orderBy: { createdAt: "desc" },
      }),
    newsPost: (_: unknown, args: { slug: string }, ctx: GraphQLContext) =>
      ctx.prisma.newsPost.findFirst({
        where: { slug: args.slug, ...visibilityWhere(ctx.session) },
      }),
  },
  Mutation: {
    createNewsPost: (_: unknown, args: { input: NewsPostInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      const { title, slug, body, excerpt, status } = args.input;
      return ctx.prisma.newsPost.create({
        data: {
          title,
          slug,
          body,
          excerpt,
          status,
          publishedAt: status === "PUBLISHED" ? new Date() : undefined,
        },
      });
    },
    updateNewsPost: async (
      _: unknown,
      args: { id: string; input: NewsPostInput },
      ctx: GraphQLContext
    ) => {
      requireAdmin(ctx);
      const { title, slug, body, excerpt, status } = args.input;
      const existing = await ctx.prisma.newsPost.findUnique({ where: { id: args.id } });
      const isNewlyPublished = status === "PUBLISHED" && existing?.status !== "PUBLISHED";
      return ctx.prisma.newsPost.update({
        where: { id: args.id },
        data: {
          title,
          slug,
          body,
          excerpt,
          status,
          publishedAt: isNewlyPublished ? new Date() : undefined,
        },
      });
    },
    deleteNewsPost: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await ctx.prisma.newsPost.delete({ where: { id: args.id } });
      return true;
    },
  },
};
