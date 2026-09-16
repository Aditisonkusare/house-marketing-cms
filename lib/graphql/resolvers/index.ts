import { DateTimeResolver, JSONResolver } from "graphql-scalars";
import type { GraphQLContext } from "@/lib/graphql/context";
import { pageContentResolvers } from "@/lib/graphql/resolvers/pageContent";
import { houseTypeResolvers } from "@/lib/graphql/resolvers/houseType";
import { newsPostResolvers } from "@/lib/graphql/resolvers/newsPost";
import { subscriberResolvers } from "@/lib/graphql/resolvers/subscriber";

export const resolvers = {
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  HouseType: houseTypeResolvers.HouseType,
  Query: {
    me: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.session?.user
        ? { id: ctx.session.user.id, email: ctx.session.user.email, name: ctx.session.user.name }
        : null,
    ...pageContentResolvers.Query,
    ...houseTypeResolvers.Query,
    ...newsPostResolvers.Query,
  },
  Mutation: {
    ...pageContentResolvers.Mutation,
    ...houseTypeResolvers.Mutation,
    ...newsPostResolvers.Mutation,
    ...subscriberResolvers.Mutation,
  },
};
