import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";

const productsData = [
  {
    name: "Essential Wash",
    slug: "essential-wash",
    description: "Perfect for regular maintenance. A quick but thorough clean that keeps your car looking fresh.",
    shortDescription: "Quick maintenance wash",
    price: "99.99",
    durationMinutes: 60,
    features: [
      "Interior Blow Out + Vacuum",
      "Interior Wipe Down",
      "Wheel Wash",
      "Complete Foam Bath",
      "Tire Shine",
    ],
    isActive: true,
    isSubscription: false,
    sortOrder: 1,
  },
  {
    name: "Full Detail",
    slug: "full-detail",
    description: "Most popular for car enthusiasts. Complete interior and exterior treatment for a showroom-ready finish.",
    shortDescription: "Complete interior & exterior detail",
    price: "179.99",
    durationMinutes: 120,
    features: [
      "Interior Blow Out + Vacuum",
      "Interior Contact Wash",
      "Interior Trim Cleanse",
      "Steering Wheel Cleanse",
      "Floor Mat Treatment",
      "Wheel Wells & Brake Cleanse",
      "Wheel Foam Bath",
      "Contactless Pre Wash",
      "Complete Foam Bath",
      "Tire Shine",
    ],
    isActive: true,
    isSubscription: false,
    sortOrder: 2,
  },
  {
    name: "VIP Showroom Detail",
    slug: "vip-showroom-detail",
    description: "The ultimate showroom finish. Full paint decontamination and ceramic coating for maximum protection and shine.",
    shortDescription: "Premium ceramic coating package",
    price: "284.99",
    durationMinutes: 180,
    features: [
      "Interior Blow Out + Vacuum",
      "Interior Contact Wash",
      "Interior Trim Cleanse",
      "Carpet & Floor Mat Extraction",
      "Wheel Wells & Brake Cleanse",
      "Wheel Foam Bath",
      "Contactless Pre Wash",
      "Complete Foam Bath",
      "Full Paint Decontamination",
      "Complete Vehicle Ceramic Coating",
    ],
    isActive: true,
    isSubscription: false,
    sortOrder: 3,
  },
  {
    name: "Monthly Plan",
    slug: "monthly-plan",
    description: "Best value for regulars. 4 Essential Washes per month with priority scheduling.",
    shortDescription: "4 washes/month subscription",
    price: "249.99",
    durationMinutes: 60,
    features: [
      "4 Essential Washes per month",
      "Priority Scheduling",
      "Cancel Anytime",
      "Save $150+ Monthly",
    ],
    isActive: true,
    isSubscription: true,
    subscriptionInterval: "monthly",
    sortOrder: 4,
  },
];

const addonsData = [
  {
    name: "Engine Bay Detail",
    description: "Deep clean and degrease of engine compartment",
    price: "49.99",
    durationMinutes: 30,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Headlight Restoration",
    description: "Remove oxidation and restore clarity to foggy headlights",
    price: "79.99",
    durationMinutes: 45,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Odor Elimination",
    description: "Deep ozone treatment to remove stubborn odors",
    price: "39.99",
    durationMinutes: 20,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Pet Hair Removal",
    description: "Thorough removal of pet hair from all surfaces",
    price: "29.99",
    durationMinutes: 30,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Leather Conditioning",
    description: "Deep condition and protect leather surfaces",
    price: "39.99",
    durationMinutes: 20,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Clay Bar Treatment",
    description: "Remove embedded contaminants from paint surface",
    price: "59.99",
    durationMinutes: 40,
    isActive: true,
    sortOrder: 6,
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // Seed products
  console.log("Inserting products...");
  for (const product of productsData) {
    await db
      .insert(schema.products)
      .values(product)
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          durationMinutes: product.durationMinutes,
          features: product.features,
          isActive: product.isActive,
          isSubscription: product.isSubscription,
          subscriptionInterval: product.subscriptionInterval,
          sortOrder: product.sortOrder,
          updatedAt: new Date(),
        },
      });
    console.log(`  - ${product.name}`);
  }

  // Seed addons
  console.log("Inserting addons...");
  for (const addon of addonsData) {
    await db
      .insert(schema.addons)
      .values(addon)
      .onConflictDoNothing();
    console.log(`  - ${addon.name}`);
  }

  // Create admin user if credentials provided
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    console.log("Creating admin user...");
    const passwordHash = await hash(adminPassword, 12);

    await db
      .insert(schema.users)
      .values({
        email: adminEmail,
        passwordHash,
        name: "Admin",
        role: "admin",
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: {
          passwordHash,
          updatedAt: new Date(),
        },
      });
    console.log(`  - Admin user: ${adminEmail}`);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
