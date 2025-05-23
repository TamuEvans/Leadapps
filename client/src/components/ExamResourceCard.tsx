import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Clock, BarChart, PlayCircle, BookOpen } from 'lucide-react';
import { ExamResource } from '@shared/schema';

interface ExamResourceCardProps {
  resource: ExamResource;
  userProgress?: {
    completionPercentage: number;
    status: string;
    timeSpent?: number;
    score?: number;
  };
  onAccess?: (resourceId: number) => void;
  onDownload?: (resourceId: number) => void;
  isLoading?: boolean;
}

export default function ExamResourceCard({ 
  resource, 
  userProgress,
  onAccess, 
  onDownload,
  isLoading = false 
}: ExamResourceCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'practice_test': return <BarChart className="h-4 w-4" />;
      case 'study_guide': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getResourceTypeIcon(resource.resourceType)}
              {resource.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {resource.description}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {resource.examType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {resource.subject}
          </Badge>
          <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Progress section for authenticated users */}
          {userProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{userProgress.completionPercentage}%</span>
              </div>
              <Progress value={userProgress.completionPercentage} className="h-2" />
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Status: {userProgress.status.replace('_', ' ')}</span>
                {userProgress.score && (
                  <span>Score: {userProgress.score}%</span>
                )}
              </div>
            </div>
          )}

          {/* Resource details */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            {resource.estimatedDuration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(resource.estimatedDuration)}</span>
              </div>
            )}
            
            {resource.downloadCount && (
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{resource.downloadCount} downloads</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{resource.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onAccess?.(resource.id)}
              disabled={isLoading}
              className="flex-1"
            >
              {userProgress?.completionPercentage > 0 ? 'Continue' : 'Start'}
            </Button>
            
            {resource.downloadUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload?.(resource.id)}
                disabled={isLoading}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Additional info */}
          {resource.prerequisites && resource.prerequisites.length > 0 && (
            <div className="text-xs text-gray-500 pt-2 border-t">
              Prerequisites: {resource.prerequisites.join(', ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}