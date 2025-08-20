import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionSchema, insertRatingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Questions routes
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.get("/api/questions/active", async (req, res) => {
    try {
      const questions = await storage.getActiveQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active questions" });
    }
  });

  app.get("/api/questions/stats", async (req, res) => {
    try {
      const questions = await storage.getQuestionsWithStats();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question statistics" });
    }
  });

  // Random question endpoint - must come before :id route
  app.get("/api/questions/random", async (req, res) => {
    try {
      const excludeIds = req.query.exclude ? 
        String(req.query.exclude).split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : 
        [];
      
      const questions = await storage.getActiveQuestions();
      const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));
      
      if (availableQuestions.length === 0) {
        // If all questions are excluded, return any active question
        const fallbackQuestions = questions;
        if (fallbackQuestions.length === 0) {
          return res.status(404).json({ message: "No active questions available" });
        }
        const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
        return res.json(fallbackQuestions[randomIndex]);
      }
      
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      res.json(availableQuestions[randomIndex]);
    } catch (error) {
      console.error("Error fetching random question:", error);
      res.status(500).json({ message: "Failed to fetch random question" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestion(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid question data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  app.put("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const questionData = insertQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(id, questionData);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid question data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update question" });
    }
  });

  app.delete("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuestion(id);
      if (!deleted) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete question" });
    }
  });



  // Ratings routes
  app.post("/api/ratings", async (req, res) => {
    try {
      const ratingData = insertRatingSchema.parse(req.body);
      const rating = await storage.createRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  app.get("/api/questions/:id/ratings", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const ratings = await storage.getRatingsForQuestion(questionId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  app.get("/api/questions/:id/average-rating", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const avgRating = await storage.getAverageRating(questionId);
      res.json({ questionId, averageRating: avgRating });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch average rating" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
