import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create a demo user
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@nexora.ai",
      name: "Demo User",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "ADMIN",
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      name: "Acme Corp",
      slug: "acme-corp",
      plan: "PRO",
      description: "Demo organization for NEXORA",
      industry: "Technology",
      website: "https://acme.example.com",
    },
  });

  console.log(`✅ Created organization: ${org.name}`);

  // Add user to organization
  await prisma.organizationMember.create({
    data: {
      organizationId: org.id,
      userId: demoUser.id,
      role: "OWNER",
    },
  });

  console.log(`✅ Added user to organization`);

  // Create demo brand
  const brand = await prisma.brand.create({
    data: {
      name: "ACME Brand Identity",
      description: "Professional brand identity for tech company",
      industry: "Technology",
      voice: "PROFESSIONAL",
      targetAudience: "B2B Enterprise Customers",
      userId: demoUser.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Created brand: ${brand.name}`);

  // Create brand identity
  await prisma.brandIdentity.create({
    data: {
      brandId: brand.id,
      primaryColor: "#1E40AF",
      secondaryColor: "#F59E0B",
      accentColor: "#10B981",
      backgroundColor: "#F9FAFB",
      textColor: "#111827",
      headingFont: "Inter",
      bodyFont: "Inter",
      baseFontSize: "16px",
    },
  });

  console.log(`✅ Created brand identity`);

  // Create demo project
  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete website redesign project",
      status: "ACTIVE",
      brandId: brand.id,
      userId: demoUser.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Created project: ${project.name}`);

  // Create demo prompt template
  const prompt = await prisma.prompt.create({
    data: {
      title: "Brand Voice Guide Generator",
      content: "Generate a comprehensive brand voice guide based on the brand identity",
      systemPrompt: "You are an expert brand strategist",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 1000,
      isTemplate: true,
      userId: demoUser.id,
      organizationId: org.id,
      tags: ["brand", "voice", "guidelines"],
    },
  });

  console.log(`✅ Created prompt template: ${prompt.title}`);

  console.log("\n✨ Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
