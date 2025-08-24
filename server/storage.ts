import { Question, Rating, InsertQuestion, InsertRating, QuestionWithStats, questions, ratings } from "@shared/schema";
import { db } from "./db";
import { eq, desc, avg, count } from "drizzle-orm";

export interface IStorage {
  // Questions
  getAllQuestions(): Promise<Question[]>;
  getActiveQuestions(): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;
  getQuestionsWithStats(): Promise<QuestionWithStats[]>;
  
  // Ratings
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsForQuestion(questionId: number): Promise<Rating[]>;
  getAverageRating(questionId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getAllQuestions(): Promise<Question[]> {
    const result = await db.select().from(questions).orderBy(desc(questions.id));
    return result;
  }

  async getActiveQuestions(): Promise<Question[]> {
    const result = await db.select().from(questions)
      .where(eq(questions.isActive, true))
      .orderBy(desc(questions.id));
    return result;
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [result] = await db.select().from(questions).where(eq(questions.id, id));
    return result || undefined;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [result] = await db
      .insert(questions)
      .values({
        text: insertQuestion.text,
        category: insertQuestion.category || "general",
        isActive: insertQuestion.isActive ?? true,
      })
      .returning();
    return result;
  }

  async updateQuestion(id: number, updates: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [result] = await db
      .update(questions)
      .set(updates)
      .where(eq(questions.id, id))
      .returning();
    return result || undefined;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getQuestionsWithStats(): Promise<QuestionWithStats[]> {
    const allQuestions = await this.getAllQuestions();
    const questionsWithStats = await Promise.all(
      allQuestions.map(async (q) => ({
        ...q,
        avgRating: await this.getAverageRating(q.id),
        totalRatings: (await this.getRatingsForQuestion(q.id)).length,
      }))
    );
    return questionsWithStats;
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const [result] = await db
      .insert(ratings)
      .values(insertRating)
      .returning();
    return result;
  }

  async getRatingsForQuestion(questionId: number): Promise<Rating[]> {
    const result = await db.select().from(ratings)
      .where(eq(ratings.questionId, questionId));
    return result;
  }

  async getAverageRating(questionId: number): Promise<number> {
    const questionRatings = await this.getRatingsForQuestion(questionId);
    if (questionRatings.length === 0) return 0;
    
    const sum = questionRatings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / questionRatings.length) * 10) / 10; // Round to 1 decimal
  }
}

export class MemStorage implements IStorage {
  private questions: Map<number, Question>;
  private ratings: Map<number, Rating>;
  private currentQuestionId: number;
  private currentRatingId: number;

  constructor() {
    this.questions = new Map();
    this.ratings = new Map();
    this.currentQuestionId = 1;
    this.currentRatingId = 1;
    
    // Seed with some magical questions
    this.seedQuestions();
  }

  private seedQuestions() {
    const sampleQuestions: InsertQuestion[] = [
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
        text: "If you could immediately gain any creative skill, what would you choose?",
        category: "curiosity",
        isActive: true,
      },
      {
        text: "When was the last time you used glitter?",
        category: "fun",
        isActive: true,
      },
      {
        text: "What is one rule you had growing up that looking back now, you think was totally unnecessary or even a little funny?",
        category: "childhood",
        isActive: true,
      },
      {
        text: "What's a gift someone gave you that offended you?",
        category: "experiences",
        isActive: true,
      },
      {
        text: "What's the best gift you ever received? What made it so special?",
        category: "gratitude",
        isActive: true,
      },
      {
        text: "What's one quirky thing you love about where you live, that most people wouldn't know about?",
        category: "personal",
        isActive: true,
      },
      {
        text: "When was the last time you wore a costume? What were you dressed as, and what was it for?",
        category: "fun",
        isActive: true,
      },
      {
        text: "What is your favorite way to eat a potato? What is your least favorite?",
        category: "fun",
        isActive: true,
      },
      {
        text: "What is your next goal for life outside of work?",
        category: "personal",
        isActive: true,
      },
      {
        text: "What's something you believed as a child that you're slightly embarrassed about now?",
        category: "childhood",
        isActive: true,
      },
      {
        text: "What's something you're unreasonably competitive about?",
        category: "personal",
        isActive: true,
      },
      {
        text: "What's the most useless talent you have?",
        category: "fun",
        isActive: true,
      },
      {
        text: "What's a unique tradition from your family or culture that you love?",
        category: "personal",
        isActive: true,
      },
      {
        text: "What's something you tried once and immediately knew wasn't for you?",
        category: "experiences",
        isActive: true,
      },
      {
        text: "What's a compliment you've received from a stranger that really stuck with you?",
        category: "gratitude",
        isActive: true,
      },
      {
        text: "If you won the lottery, how would you spend your time?",
        category: "imagination",
        isActive: true,
      },
      {
        text: "If you immediatley had to pivot into another career, what would you do instead of your current job?",
        category: "imagination",
        isActive: true,
      },
      {
        text: "What's something that always makes you feel like a kid again?",
        category: "childhood",
        isActive: true,
      },
      {
        text: "What's something new you want to try or achieve in the next year?",
        category: "growth",
        isActive: true,
      },
      {
        text: "What do you enjoy doing that is both fun and makes you sweat?",
        category: "growth",
        isActive: true,
      },
      {
        text: "What's your favorite place that most people have probabaly never heard of?",
        category: "experiences",
        isActive: true,
      },
    ];

    sampleQuestions.forEach(q => {
      const question: Question = {
        id: this.currentQuestionId++,
        text: q.text,
        category: q.category || "general",
        isActive: q.isActive ?? true,
        createdAt: new Date(),
      };
      this.questions.set(question.id, question);
    });
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => b.id - a.id);
  }

  async getActiveQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.isActive)
      .sort((a, b) => b.id - a.id);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const question: Question = {
      id: this.currentQuestionId++,
      text: insertQuestion.text,
      category: insertQuestion.category || "general",
      isActive: insertQuestion.isActive ?? true,
      createdAt: new Date(),
    };
    this.questions.set(question.id, question);
    return question;
  }

  async updateQuestion(id: number, updates: Partial<InsertQuestion>): Promise<Question | undefined> {
    const existing = this.questions.get(id);
    if (!existing) return undefined;

    const updated: Question = { ...existing, ...updates };
    this.questions.set(id, updated);
    return updated;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    return this.questions.delete(id);
  }

  async getQuestionsWithStats(): Promise<QuestionWithStats[]> {
    const questions = await this.getAllQuestions();
    return Promise.all(
      questions.map(async (q) => ({
        ...q,
        avgRating: await this.getAverageRating(q.id),
        totalRatings: this.getRatingsForQuestionSync(q.id).length,
      }))
    );
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const rating: Rating = {
      ...insertRating,
      id: this.currentRatingId++,
      createdAt: new Date(),
    };
    this.ratings.set(rating.id, rating);
    return rating;
  }

  async getRatingsForQuestion(questionId: number): Promise<Rating[]> {
    return this.getRatingsForQuestionSync(questionId);
  }

  private getRatingsForQuestionSync(questionId: number): Rating[] {
    return Array.from(this.ratings.values()).filter(r => r.questionId === questionId);
  }

  async getAverageRating(questionId: number): Promise<number> {
    const ratings = this.getRatingsForQuestionSync(questionId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
  }
}

export const storage = new MemStorage();
