import React, { createContext, useContext, useState, useEffect } from 'react';

// Define achievement types
export interface Achievement {
  id: string;
  type: 'milestone' | 'completion' | 'streak' | 'badge';
  title: string;
  description: string;
  icon: 'trophy' | 'medal' | 'star' | 'award' | 'check';
  points?: number;
  level?: number;
  unlocked?: boolean;
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  currentAchievement: Achievement | null;
  unlockAchievement: (id: string) => void;
  dismissAchievement: () => void;
  addPoints: (points: number) => void;
  points: number;
  level: number;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Predefined achievements catalog
const achievementsCatalog: Achievement[] = [
  // Profile completion achievements
  {
    id: 'profile-basic-info',
    type: 'completion',
    title: 'First Steps',
    description: 'You've completed your basic profile information',
    icon: 'check',
    points: 10,
  },
  {
    id: 'profile-education',
    type: 'completion',
    title: 'Academic Background',
    description: 'You've added your educational history',
    icon: 'check',
    points: 15,
  },
  {
    id: 'profile-documents',
    type: 'completion',
    title: 'Document Master',
    description: 'You've uploaded all your important documents',
    icon: 'check',
    points: 20,
  },
  {
    id: 'profile-complete',
    type: 'milestone',
    title: '100% Complete!',
    description: 'Your profile is now complete and ready for applications',
    icon: 'trophy',
    points: 50,
  },
  
  // Application achievements
  {
    id: 'first-application',
    type: 'milestone',
    title: 'Application Pioneer',
    description: 'You submitted your first university application',
    icon: 'medal',
    points: 25,
  },
  {
    id: 'three-applications',
    type: 'milestone',
    title: 'Options Explorer',
    description: 'You've submitted applications to 3 different universities',
    icon: 'star',
    points: 40,
  },
  
  // Engagement achievements
  {
    id: 'personality-assessment',
    type: 'completion',
    title: 'Self Discovery',
    description: 'You completed the personality assessment',
    icon: 'award',
    points: 30,
  },
  {
    id: 'login-streak-7',
    type: 'streak',
    title: 'Dedication Badge',
    description: 'You've checked in for 7 days in a row',
    icon: 'star',
    points: 35,
  },
];

// Calculate level based on points
const calculateLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
};

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load achievements and points from localStorage
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : achievementsCatalog;
  });
  
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('achievement-points');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [level, setLevel] = useState<number>(calculateLevel(points));
  
  // Save achievements and points to localStorage
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('achievement-points', points.toString());
    setLevel(calculateLevel(points));
  }, [points]);
  
  // Get unlocked achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  // Function to unlock an achievement
  const unlockAchievement = (id: string) => {
    // Find the achievement
    const achievement = achievements.find(a => a.id === id);
    
    if (achievement && !achievement.unlocked) {
      // Update the achievement to unlocked
      const updatedAchievements = achievements.map(a => 
        a.id === id ? { ...a, unlocked: true } : a
      );
      
      setAchievements(updatedAchievements);
      setCurrentAchievement(achievement);
      
      // Add points
      if (achievement.points) {
        setPoints(prevPoints => prevPoints + achievement.points!);
      }
    }
  };
  
  // Function to dismiss the current achievement
  const dismissAchievement = () => {
    setCurrentAchievement(null);
  };
  
  // Function to add points (without unlocking an achievement)
  const addPoints = (pointsToAdd: number) => {
    setPoints(prevPoints => prevPoints + pointsToAdd);
  };
  
  const contextValue: AchievementContextType = {
    achievements,
    unlockedAchievements,
    currentAchievement,
    unlockAchievement,
    dismissAchievement,
    addPoints,
    points,
    level
  };
  
  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
    </AchievementContext.Provider>
  );
};

// Hook for using the achievement context
export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export default AchievementProvider;