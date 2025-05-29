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

export const storage = new DatabaseStorage();
