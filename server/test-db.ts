import { db } from "./db";
import { questions } from "@shared/schema";

async function testDatabase() {
  try {
    console.log("Testing database connection...");
    const result = await db.select().from(questions);
    console.log(`✓ Database connection successful! Found ${result.length} questions`);
    console.log("Sample questions:", result.slice(0, 3));
  } catch (error) {
    console.error("✗ Database connection failed:", error);
  }
}

testDatabase();