import type { Session } from "next-auth";
import type { prisma } from "@/lib/prisma";

export type GraphQLContext = {
  session: Session | null;
  prisma: typeof prisma;
};
