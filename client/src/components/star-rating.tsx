import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  onRating: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StarRating({ onRating, size = "md", className }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    onRating(rating);
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {stars.map((star) => {
        const isActive = (hoveredRating ?? selectedRating ?? 0) >= star;
        
        return (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => handleClick(star)}
            className={cn(
              "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded",
              isActive ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"
            )}
            disabled={selectedRating !== null}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isActive ? "fill-current" : ""
              )}
            />
          </motion.button>
        );
      })}
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
