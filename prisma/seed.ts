import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin", role: "ADMIN" },
  });
  console.log(`Seeded admin user: ${email}`);

  await prisma.houseType.upsert({
    where: { slug: "the-hazel" },
    update: {},
    create: {
      name: "3-Bed Semi-Detached — The Hazel",
      slug: "the-hazel",
      description: "A spacious 3-bedroom semi-detached home with a private garden.",
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994"],
      priceFrom: 385000,
      bedrooms: 3,
      bathrooms: 1,
      floorAreaSqm: 110,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.houseType.upsert({
    where: { slug: "garden" },
    update: {},
    create: {
      name: "2-Bed Detached",
      slug: "garden",
      description: "2 Bed, 2 Bath, 150 sq mt",
      images: [],
      priceFrom: 235000,
      bedrooms: 2,
      bathrooms: 2,
      floorAreaSqm: 149.98,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.newsPost.upsert({
    where: { slug: "phase-2-now-selling" },
    update: {},
    create: {
      title: "Phase 2 now selling",
      slug: "phase-2-now-selling",
      excerpt: "Phase 2 of the development is now open for reservations.",
      body: "We are delighted to announce Phase 2 is now selling. Contact us to register your interest.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // Fake example subscribers only — never seed real people's email addresses
  // into a script that's committed to a public repo.
  await prisma.subscriber.upsert({
    where: { email: "alice.example@example.com" },
    update: {},
    create: { name: "Alice Example", email: "alice.example@example.com", consent: true },
  });

  await prisma.subscriber.upsert({
    where: { email: "bob.example@example.com" },
    update: {},
    create: { name: "Bob Example", email: "bob.example@example.com", consent: true },
  });

  console.log("Seeded house types, news post, and example subscribers");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
