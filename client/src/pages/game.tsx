import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, RefreshCw, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQuestions } from "@/hooks/use-questions";
import QuestionCard from "@/components/question-card";
import LanguageSelector from "@/components/language-selector";

export default function GamePage() {
  const { theme, setTheme } = useTheme();
  const [recentQuestionIds, setRecentQuestionIds] = useState<number[]>([]);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [questionCount, setQuestionCount] = useState(0);

  const { 
    currentQuestion, 
    fetchRandomQuestion, 
    isLoading, 
    error,
    submitRating 
  } = useQuestions(recentQuestionIds);

  useEffect(() => {
    // Load initial question
    fetchRandomQuestion();
  }, []);

  const handleNewQuestion = () => {
    if (currentQuestion) {
      setRecentQuestionIds(prev => {
        const updated = [currentQuestion.id, ...prev];
        // Keep only last 5 questions to avoid repeats
        return updated.slice(0, 5);
      });
    }
    setQuestionCount(prev => prev + 1);
    fetchRandomQuestion();
  };

  const handleRating = async (rating: number) => {
    if (currentQuestion) {
      await submitRating({
        questionId: currentQuestion.id,
        rating,
        sessionId
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 magical-gradient rounded-xl flex items-center justify-center animate-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Magical Questions
              </h1>
              <p className="text-sm text-muted-foreground">Team Building Game</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Game Stats */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{questionCount}</div>
                <div className="text-sm text-muted-foreground">Questions Explored</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {currentQuestion ? currentQuestion.category : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Current Category</div>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 magical-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-sparkle">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Finding the perfect question...</h3>
                <p className="text-muted-foreground">The magic is happening! ✨</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-16"
              >
                <Card className="border-destructive">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-destructive mb-2">
                      Oops! Something went wrong
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => fetchRandomQuestion()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                onNewQuestion={handleNewQuestion}
                onRating={handleRating}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-16"
              >
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">Welcome to Magical Questions!</h3>
                    <p className="text-muted-foreground mb-4">
                      Ready to explore meaningful conversations with your team?
                    </p>
                    <Button onClick={() => fetchRandomQuestion()}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="glass-effect border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  How to Play
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">1</Badge>
                    <p>Read the magical question aloud to your team</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">2</Badge>
                    <p>Give everyone time to think and share their answers</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">3</Badge>
                    <p>Rate the question based on how engaging it was</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">4</Badge>
                    <p>Click "New Question" to continue the magical journey!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
