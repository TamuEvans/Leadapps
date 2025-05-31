import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProfileProgressProps {
  completionPercentage: number;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ completionPercentage }) => {
  return (
    <div className="w-full md:w-64">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Profile completion</span>
        <span className="text-sm font-bold text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">{completionPercentage}%</span>
      </div>
      <div className="relative">
        <Progress value={completionPercentage} className="h-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full overflow-hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full opacity-90" 
             style={{ width: `${completionPercentage}%` }}>
          <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgress;
