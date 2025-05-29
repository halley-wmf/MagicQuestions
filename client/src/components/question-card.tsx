import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Question } from "@shared/schema";
import ThumbsRating from "./star-rating";

interface QuestionCardProps {
  question: Question;
  onNewQuestion: () => void;
  onRating: (rating: number) => void;
}

export default function QuestionCard({ question, onNewQuestion, onRating }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Card className="magical-gradient p-1 animate-glow">
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardContent className="pt-8 pb-6">
            <div className="text-center space-y-6">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-sm px-4 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                >
                  {question.category}
                </Badge>
              </motion.div>

              {/* Question Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-center px-4">
                  {question.text}
                </h2>
              </motion.div>

              {/* Rating Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    How engaging was this question?
                  </p>
                  <ThumbsRating
                    onRating={onRating}
                    size="lg"
                  />
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={onNewQuestion}
                  size="lg"
                  className="warm-gradient text-white font-semibold px-8 py-3 rounded-full hover:scale-105 transition-transform duration-200"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  New Question
                </Button>
              </motion.div>

              {/* Question ID */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-muted-foreground"
              >
                Question #{question.id}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </Card>
    </motion.div>
  );
}
