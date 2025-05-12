import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProfileProgressProps {
  completionPercentage: number;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ completionPercentage }) => {
  return (
    <div className="w-full md:w-64">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Profile completion</span>
        <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
      </div>
      <Progress value={completionPercentage} className="h-2.5 bg-gray-200" />
    </div>
  );
};

export default ProfileProgress;
