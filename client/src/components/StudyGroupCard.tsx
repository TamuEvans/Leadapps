import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Clock, BookOpen, Lock } from 'lucide-react';
import { StudyGroup } from '@shared/schema';

interface StudyGroupCardProps {
  studyGroup: StudyGroup & { memberCount?: number };
  onJoin?: (groupId: number) => void;
  onView?: (groupId: number) => void;
  isJoined?: boolean;
  isLoading?: boolean;
}

export default function StudyGroupCard({ 
  studyGroup, 
  onJoin, 
  onView, 
  isJoined = false,
  isLoading = false 
}: StudyGroupCardProps) {
  const memberCount = studyGroup.memberCount || 0;
  const isGroupFull = memberCount >= (studyGroup.maxMembers || 10);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {studyGroup.name}
              {studyGroup.isPrivate && <Lock className="h-4 w-4 text-gray-500" />}
            </CardTitle>
            <CardDescription className="mt-1">
              {studyGroup.description}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            {studyGroup.examType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {studyGroup.subject}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Member count and capacity */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{memberCount}/{studyGroup.maxMembers} members</span>
            </div>
            {studyGroup.studySchedule && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{studyGroup.studySchedule}</span>
              </div>
            )}
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(memberCount / studyGroup.maxMembers) * 100}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(studyGroup.id)}
              className="flex-1"
            >
              View Details
            </Button>
            
            {!isJoined && (
              <Button
                size="sm"
                onClick={() => onJoin?.(studyGroup.id)}
                disabled={isGroupFull || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Joining...' : isGroupFull ? 'Full' : 'Join Group'}
              </Button>
            )}
            
            {isJoined && (
              <Badge variant="success" className="px-3 py-1">
                Member
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}