import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, Users, Play, Download, Heart, Share2, ChevronRight } from "lucide-react";

interface MobileExamCardProps {
  resource: {
    id: number;
    title: string;
    description: string;
    examType: string;
    subject: string;
    resourceType: string;
    difficulty: string;
    duration: number;
    isPremium: boolean;
    progress?: number;
    isLiked?: boolean;
  };
  onStart?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

export default function MobileExamCard({ resource, onStart, onLike, onShare }: MobileExamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = () => {
    switch (resource.resourceType) {
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'pdf': return <Download className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full mb-3 shadow-sm">
      <CardContent className="p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {resource.examType}
              </Badge>
              {resource.isPremium && (
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  Premium
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-sm leading-tight mb-1">
              {resource.title}
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              {resource.subject} • {resource.resourceType}
            </p>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className={`h-4 w-4 transform transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`} />
          </button>
        </div>

        {/* Quick Info Row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{resource.duration}min</span>
          </div>
          <Badge className={getDifficultyColor(resource.difficulty)} variant="outline">
            {resource.difficulty}
          </Badge>
        </div>

        {/* Progress Bar (if applicable) */}
        {resource.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{resource.progress}%</span>
            </div>
            <Progress value={resource.progress} className="h-2" />
          </div>
        )}

        {/* Expanded Description */}
        {isExpanded && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{resource.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={onStart}
            className="h-10 text-sm"
            variant={resource.progress ? "outline" : "default"}
          >
            <div className="flex items-center gap-2">
              {getResourceIcon()}
              <span>
                {resource.progress ? 'Continue' : 'Start'}
              </span>
            </div>
          </Button>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10"
              onClick={onLike}
            >
              <Heart className={`h-4 w-4 ${
                resource.isLiked ? 'fill-current text-red-500' : ''
              }`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}