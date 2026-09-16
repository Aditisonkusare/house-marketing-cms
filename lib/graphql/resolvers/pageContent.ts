import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import type { GraphQLContext } from "@/lib/graphql/context";
import { requireAdmin, visibilityWhere } from "@/lib/graphql/resolvers/helpers";

function handleSlugConflict(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new GraphQLError("A page content entry with this slug already exists", {
      extensions: { code: "DUPLICATE_SLUG" },
    });
  }
  throw error;
}

export const pageContentResolvers = {
  Query: {
    pageContents: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.prisma.pageContent.findMany({
        where: { ...visibilityWhere(ctx.session) },
        orderBy: { updatedAt: "desc" },
      }),
    pageContent: (_: unknown, args: { slug: string }, ctx: GraphQLContext) =>
      ctx.prisma.pageContent.findFirst({
        where: { slug: args.slug, ...visibilityWhere(ctx.session) },
      }),
  },
  Mutation: {
    createPageContent: async (
      _: unknown,
      args: { input: { slug: string; title?: string; content: unknown; status?: "DRAFT" | "PUBLISHED" } },
      ctx: GraphQLContext
    ) => {
      requireAdmin(ctx);
      const { slug, title, content, status } = args.input;
      try {
        return await ctx.prisma.pageContent.create({
          data: {
            slug,
            title,
            content: content as object,
            status,
            publishedAt: status === "PUBLISHED" ? new Date() : undefined,
          },
        });
      } catch (error) {
        handleSlugConflict(error);
      }
    },
    updatePageContent: async (
      _: unknown,
      args: { id: string; input: { slug: string; title?: string; content: unknown; status?: "DRAFT" | "PUBLISHED" } },
      ctx: GraphQLContext
    ) => {
      requireAdmin(ctx);
      const { slug, title, content, status } = args.input;
      const existing = await ctx.prisma.pageContent.findUnique({ where: { id: args.id } });
      const isNewlyPublished = status === "PUBLISHED" && existing?.status !== "PUBLISHED";
      try {
        return await ctx.prisma.pageContent.update({
          where: { id: args.id },
          data: {
            slug,
            title,
            content: content as object,
            status,
            publishedAt: isNewlyPublished ? new Date() : undefined,
          },
        });
      } catch (error) {
        handleSlugConflict(error);
      }
    },
    deletePageContent: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await ctx.prisma.pageContent.delete({ where: { id: args.id } });
      return true;
    },
  },
};
