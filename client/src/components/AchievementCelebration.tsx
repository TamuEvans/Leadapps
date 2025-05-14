import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  type: 'milestone' | 'completion' | 'streak' | 'badge';
  title: string;
  description: string;
  icon: 'trophy' | 'medal' | 'star' | 'award' | 'check';
  points?: number;
  level?: number;
}

interface AchievementCelebrationProps {
  achievement?: Achievement | null;
  onClose: () => void;
}

export const AchievementCelebration = ({ 
  achievement,
  onClose 
}: AchievementCelebrationProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (achievement) {
      setVisible(true);
      
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Allow exit animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);
  
  if (!achievement) return null;
  
  // Render different icons based on achievement type
  const renderIcon = () => {
    switch (achievement.icon) {
      case 'trophy':
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 'medal':
        return <Medal className="h-12 w-12 text-blue-500" />;
      case 'star':
        return <Star className="h-12 w-12 text-purple-500" />;
      case 'award':
        return <Award className="h-12 w-12 text-green-500" />;
      default:
        return <CheckCircle2 className="h-12 w-12 text-teal-500" />;
    }
  };
  
  // Determine celebration background color
  const getBgColor = () => {
    switch (achievement.type) {
      case 'milestone':
        return 'bg-gradient-to-br from-blue-500 to-indigo-700';
      case 'completion':
        return 'bg-gradient-to-br from-green-500 to-emerald-700';
      case 'streak':
        return 'bg-gradient-to-br from-orange-500 to-amber-700';
      case 'badge':
        return 'bg-gradient-to-br from-purple-500 to-violet-700';
      default:
        return 'bg-gradient-to-br from-blue-500 to-indigo-700';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            className={`max-w-md w-full mx-4 rounded-lg shadow-2xl overflow-hidden ${getBgColor()}`}
          >
            <div className="p-8 text-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ 
                  rotate: [0, -5, 0, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: 1,
                  repeatDelay: 1
                }}
                className="inline-block bg-white p-6 rounded-full mb-4 shadow-lg"
              >
                {renderIcon()}
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">
                  {achievement.title}
                </h2>
                <p className="text-white/90 mb-4">
                  {achievement.description}
                </p>
                
                {achievement.points && (
                  <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold text-sm mb-4">
                    +{achievement.points} POINTS
                  </div>
                )}
                
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      setVisible(false);
                      setTimeout(onClose, 300);
                    }}
                    variant="secondary"
                    className="font-medium px-6"
                  >
                    Awesome!
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementCelebration;