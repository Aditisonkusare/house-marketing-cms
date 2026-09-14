import { GraphQLError } from "graphql";
import type { Session } from "next-auth";
import type { GraphQLContext } from "@/lib/graphql/context";

/**
 * Unauthenticated callers only ever see PUBLISHED content. Authenticated
 * (admin) callers see everything, drafts included. Applied to every list
 * AND single-item query so an unauthenticated slug lookup for a draft
 * returns null instead of leaking that the record exists.
 */
export function visibilityWhere(session: Session | null) {
  return session?.user ? {} : ({ status: "PUBLISHED" as const });
}

export function requireAdmin(ctx: GraphQLContext) {
  if (!ctx.session?.user) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
}
