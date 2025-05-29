import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThumbsRatingProps {
  onRating: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ThumbsRating({ onRating, size = "md", className }: ThumbsRatingProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9"
  };

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    onRating(rating);
  };

  return (
    <div className={cn("flex items-center justify-center space-x-6", className)}>
      {/* Thumbs Down */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick(1)}
        className={cn(
          "p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
          selectedRating === 1
            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-100"
            : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-red-900 dark:hover:text-red-400"
        )}
        disabled={selectedRating !== null}
      >
        <ThumbsDown className={cn(sizeClasses[size])} />
      </motion.button>

      {/* Thumbs Up */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick(2)}
        className={cn(
          "p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          selectedRating === 2
            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-100"
            : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-green-900 dark:hover:text-green-400"
        )}
        disabled={selectedRating !== null}
      >
        <ThumbsUp className={cn(sizeClasses[size])} />
      </motion.button>

      {selectedRating && (
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 text-sm font-medium text-muted-foreground"
        >
          Thank you for rating!
        </motion.span>
      )}
    </div>
  );
}
