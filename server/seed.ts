import { db } from "./db";
import { questions } from "@shared/schema";

const sampleQuestions = [
  {
    text: "If you could have any magical power for one day, what would you do with it and why?",
    category: "imagination",
    isActive: true,
  },
  {
    text: "What's a childhood dream you had that you'd love to revisit as an adult?",
    category: "personal",
    isActive: true,
  },
  {
    text: "If you could create a new holiday, what would it celebrate and how would people observe it?",
    category: "creativity",
    isActive: true,
  },
  {
    text: "What's something you've learned recently that completely changed your perspective?",
    category: "growth",
    isActive: true,
  },
  {
    text: "If you could have dinner with any fictional character, who would it be and what would you ask them?",
    category: "imagination",
    isActive: true,
  },
  {
    text: "What's a small act of kindness someone did for you that you'll never forget?",
    category: "gratitude",
    isActive: true,
  },
  {
    text: "If you could master any skill instantly, what would it be and how would you use it?",
    category: "personal",
    isActive: true,
  },
  {
    text: "What's the most beautiful place you've ever been, and what made it special?",
    category: "experiences",
    isActive: true,
  },
  {
    text: "If you could send a message to your past self, what would you say?",
    category: "reflection",
    isActive: true,
  },
  {
    text: "What's something you're curious about that you'd love to explore more?",
    category: "curiosity",
    isActive: true,
  },
];

async function seedDatabase() {
  console.log("Seeding database with sample questions...");
  
  try {
    // Check if questions already exist
    const existingQuestions = await db.select().from(questions);
    
    if (existingQuestions.length === 0) {
      await db.insert(questions).values(sampleQuestions);
      console.log(`✓ Seeded ${sampleQuestions.length} sample questions`);
    } else {
      console.log(`Database already contains ${existingQuestions.length} questions`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();