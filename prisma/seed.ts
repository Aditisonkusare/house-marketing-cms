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
      images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be"],
      priceFrom: 235000,
      bedrooms: 2,
      bathrooms: 2,
      floorAreaSqm: 149.98,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.pageContent.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "Homepage",
      status: "PUBLISHED",
      publishedAt: new Date(),
      content: {
        heroHeading: "Welcome Home to Glenveagh",
        heroSubheading:
          "A collection of thoughtfully designed 2 and 3-bedroom homes, set in a peaceful, well-connected neighbourhood.",
        heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        introHeading: "Phase 2 — About this development",
        introBody:
          "Glenveagh is a new residential development offering a range of 2, 3 and 4-bedroom homes designed for modern family living. Each home is finished to a high standard, with energy-efficient heating, generous private gardens, and easy access to local schools, parks, and transport links.\n\nPhase 1 is complete and now home to its first residents. Phase 2 is open for reservations, with a limited number of house types still available. Register below to be the first to hear about new releases, showhouse openings, and community updates.",
      },
    },
  });

  await prisma.pageContent.upsert({
    where: { slug: "phase-3-preview" },
    update: {},
    create: {
      slug: "phase-3-preview",
      title: "Phase 3 Preview (draft)",
      status: "DRAFT",
      content: {
        introHeading: "Phase 3 — Coming December 2027",
        introBody:
          "Early plans for Phase 3 are underway, including a new selection of 3 and 4-bedroom homes. Details are still being finalised and this page is not yet ready to publish.",
      },
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

  await prisma.newsPost.upsert({
    where: { slug: "phase-3-coming-soon" },
    update: {},
    create: {
      title: "Phase 3",
      slug: "phase-3-coming-soon",
      body: "Register here",
      status: "DRAFT",
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

  console.log("Seeded page content, house types, news posts, and example subscribers");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
