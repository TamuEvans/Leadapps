import React from 'react';
import { useAchievements } from '@/contexts/AchievementContext';
import { Trophy, Award, Star, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

const UserProgress: React.FC = () => {
  const { points, level, unlockedAchievements } = useAchievements();
  
  // Calculate progress to next level
  const pointsToNextLevel = (level * 100);
  const progressToNextLevel = (points % 100) / 100;
  
  // For animation: calculate how many points were just added
  const [displayPoints, setDisplayPoints] = React.useState(points);
  
  React.useEffect(() => {
    // If points increased, animate the counter
    if (points > displayPoints) {
      const interval = setInterval(() => {
        setDisplayPoints(prev => {
          if (prev >= points) {
            clearInterval(interval);
            return points;
          }
          return prev + 1;
        });
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      // If points decreased (shouldn't normally happen), just update
      setDisplayPoints(points);
    }
  }, [points]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 0.5, repeat: 0 }}
          >
            <Trophy className="text-yellow-500 w-4 h-4" />
          </motion.div>
          <h3 className="font-semibold text-sm text-gray-800">Student Progress</h3>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-purple-500 text-purple-500" />
                <span>{displayPoints} pts</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Earn points by completing your profile and submitting applications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="relative">
            <div 
              className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold"
            >
              {level}
            </div>
            <motion.div 
              className="absolute inset-0 rounded-full bg-indigo-500 opacity-30"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "loop" 
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700">Level {level}</span>
        </div>
        
        <span className="text-[10px] text-gray-500">{points % 100}/{100} XP to Lvl {level + 1}</span>
      </div>
      
      <Progress value={progressToNextLevel * 100} className="h-1.5" />
      
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1.5">
          <h4 className="text-xs font-medium text-gray-700 flex items-center gap-0.5">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>Achievements</span>
          </h4>
          <span className="text-[10px] text-gray-500">{unlockedAchievements.length}/{unlockedAchievements.length + 4}</span>
        </div>
        
        <div className="grid grid-cols-4 gap-1.5">
          {unlockedAchievements.slice(0, 4).map((achievement) => (
            <TooltipProvider key={achievement.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative h-7 w-7 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    {achievement.icon === 'trophy' && <Trophy className="h-4 w-4 text-yellow-500" />}
                    {achievement.icon === 'medal' && <Award className="h-4 w-4 text-blue-500" />}
                    {achievement.icon === 'star' && <Star className="h-4 w-4 text-purple-500" />}
                    {achievement.icon === 'award' && <Award className="h-4 w-4 text-green-500" />}
                    {achievement.icon === 'check' && <CheckCircle className="h-4 w-4 text-teal-500" />}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-xs">{achievement.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          
          {unlockedAchievements.length < 4 && Array.from({ length: 4 - unlockedAchievements.length }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="h-7 w-7 flex items-center justify-center bg-gray-100 rounded text-gray-300"
            >
              <Star className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProgress;