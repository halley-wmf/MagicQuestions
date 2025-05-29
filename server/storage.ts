import { Question, Rating, InsertQuestion, InsertRating, QuestionWithStats } from "@shared/schema";

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
        text: "What's something you're curious about that you'd love to explore more?",
        category: "curiosity",
        isActive: true,
      },
    ];

    sampleQuestions.forEach(q => {
      const question: Question = {
        ...q,
        id: this.currentQuestionId++,
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
      ...insertQuestion,
      id: this.currentQuestionId++,
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
