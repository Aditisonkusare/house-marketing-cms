import type { GraphQLContext } from "@/lib/graphql/context";
import { requireAdmin, visibilityWhere } from "@/lib/graphql/resolvers/helpers";

type HouseTypeInput = {
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  priceFrom: number;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqm: number;
  status?: "DRAFT" | "PUBLISHED";
};

export const houseTypeResolvers = {
  HouseType: {
    priceFrom: (parent: { priceFrom: unknown }) => Number(parent.priceFrom),
    floorAreaSqm: (parent: { floorAreaSqm: unknown }) => Number(parent.floorAreaSqm),
  },
  Query: {
    houseTypes: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.prisma.houseType.findMany({
        where: { ...visibilityWhere(ctx.session) },
        orderBy: { createdAt: "desc" },
      }),
    houseType: (_: unknown, args: { slug: string }, ctx: GraphQLContext) =>
      ctx.prisma.houseType.findFirst({
        where: { slug: args.slug, ...visibilityWhere(ctx.session) },
      }),
  },
  Mutation: {
    createHouseType: (_: unknown, args: { input: HouseTypeInput }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      const { name, slug, description, images, priceFrom, bedrooms, bathrooms, floorAreaSqm, status } =
        args.input;
      return ctx.prisma.houseType.create({
        data: {
          name,
          slug,
          description,
          images: images ?? [],
          priceFrom,
          bedrooms,
          bathrooms,
          floorAreaSqm,
          status,
          publishedAt: status === "PUBLISHED" ? new Date() : undefined,
        },
      });
    },
    updateHouseType: async (
      _: unknown,
      args: { id: string; input: HouseTypeInput },
      ctx: GraphQLContext
    ) => {
      requireAdmin(ctx);
      const { name, slug, description, images, priceFrom, bedrooms, bathrooms, floorAreaSqm, status } =
        args.input;
      const existing = await ctx.prisma.houseType.findUnique({ where: { id: args.id } });
      const isNewlyPublished = status === "PUBLISHED" && existing?.status !== "PUBLISHED";
      return ctx.prisma.houseType.update({
        where: { id: args.id },
        data: {
          name,
          slug,
          description,
          images,
          priceFrom,
          bedrooms,
          bathrooms,
          floorAreaSqm,
          status,
          publishedAt: isNewlyPublished ? new Date() : undefined,
        },
      });
    },
    deleteHouseType: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      await ctx.prisma.houseType.delete({ where: { id: args.id } });
      return true;
    },
  },
};
