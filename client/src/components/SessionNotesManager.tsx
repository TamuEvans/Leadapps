import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, Target, TrendingUp, Calendar, Plus, Edit, Save, User } from "lucide-react";

interface SessionNote {
  id: number;
  appointmentId: number;
  studentName: string;
  counselorName: string;
  sessionDate: string;
  duration: number;
  sessionType: string;
  topicsDiscussed: string[];
  goals: string[];
  progress: string;
  nextSteps: string[];
  followUpDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface ProgressGoal {
  id: number;
  studentId: number;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  milestones: string[];
  createdAt: string;
}

export default function SessionNotesManager() {
  const [activeTab, setActiveTab] = useState("notes");
  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteForm, setNoteForm] = useState({
    topicsDiscussed: '',
    goals: '',
    progress: '',
    nextSteps: '',
    followUpDate: '',
    priority: 'medium' as const
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessionNotes = [] } = useQuery({
    queryKey: ['/api/counseling/session-notes'],
  });

  const { data: progressGoals = [] } = useQuery({
    queryKey: ['/api/counseling/progress-goals'],
  });

  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ['/api/appointments/upcoming'],
  });

  const saveNotesMutation = useMutation({
    mutationFn: (noteData: any) => 
      apiRequest('POST', '/api/counseling/session-notes', noteData),
    onSuccess: () => {
      toast({
        title: "Session Notes Saved",
        description: "Student progress has been documented successfully.",
      });
      setIsEditing(false);
      setSelectedNote(null);
      queryClient.invalidateQueries({ queryKey: ['/api/counseling/session-notes'] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: (goalData: any) => 
      apiRequest('PATCH', `/api/counseling/progress-goals/${goalData.id}`, goalData),
    onSuccess: () => {
      toast({
        title: "Progress Updated",
        description: "Student goal progress has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/counseling/progress-goals'] });
    },
  });

  const handleSaveNotes = () => {
    if (!selectedNote) return;

    const noteData = {
      appointmentId: selectedNote.appointmentId,
      topicsDiscussed: noteForm.topicsDiscussed.split(',').map(t => t.trim()),
      goals: noteForm.goals.split(',').map(g => g.trim()),
      progress: noteForm.progress,
      nextSteps: noteForm.nextSteps.split(',').map(s => s.trim()),
      followUpDate: noteForm.followUpDate || null,
      priority: noteForm.priority,
      status: 'completed'
    };

    saveNotesMutation.mutate(noteData);
  };

  const startEditingNote = (note: SessionNote) => {
    setSelectedNote(note);
    setNoteForm({
      topicsDiscussed: note.topicsDiscussed.join(', '),
      goals: note.goals.join(', '),
      progress: note.progress,
      nextSteps: note.nextSteps.join(', '),
      followUpDate: note.followUpDate || '',
      priority: note.priority
    });
    setIsEditing(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sessionNotes.length}</p>
                <p className="text-sm text-gray-600">Session Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progressGoals.length}</p>
                <p className="text-sm text-gray-600">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-gray-600">Goal Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notes">Session Notes</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
        </TabsList>

        {/* Session Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Session Notes</span>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student">Student</Label>
                    <Input 
                      id="student" 
                      value={selectedNote?.studentName || ''} 
                      disabled 
                    />
                  </div>
                  <div>
                    <Label htmlFor="session-date">Session Date</Label>
                    <Input 
                      id="session-date" 
                      value={selectedNote?.sessionDate || ''} 
                      disabled 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="topics">Topics Discussed (comma-separated)</Label>
                  <Textarea
                    id="topics"
                    value={noteForm.topicsDiscussed}
                    onChange={(e) => setNoteForm({ ...noteForm, topicsDiscussed: e.target.value })}
                    placeholder="University applications, career planning, study strategies..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">Goals Set (comma-separated)</Label>
                  <Textarea
                    id="goals"
                    value={noteForm.goals}
                    onChange={(e) => setNoteForm({ ...noteForm, goals: e.target.value })}
                    placeholder="Complete application essays, improve test scores..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="progress">Progress Summary</Label>
                  <Textarea
                    id="progress"
                    value={noteForm.progress}
                    onChange={(e) => setNoteForm({ ...noteForm, progress: e.target.value })}
                    placeholder="Student showed improvement in time management..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="next-steps">Next Steps (comma-separated)</Label>
                  <Textarea
                    id="next-steps"
                    value={noteForm.nextSteps}
                    onChange={(e) => setNoteForm({ ...noteForm, nextSteps: e.target.value })}
                    placeholder="Schedule university visits, prepare for interviews..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="follow-up">Follow-up Date (Optional)</Label>
                    <Input
                      id="follow-up"
                      type="date"
                      value={noteForm.followUpDate}
                      onChange={(e) => setNoteForm({ ...noteForm, followUpDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={noteForm.priority} onValueChange={(value: any) => setNoteForm({ ...noteForm, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSaveNotes}
                    disabled={saveNotesMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saveNotesMutation.isPending ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Session Notes</h3>
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Session Note
                </Button>
              </div>

              {sessionNotes.map((note: SessionNote) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{note.studentName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(note.sessionDate).toLocaleDateString()} • {note.duration} minutes
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(note.priority)}>
                          {note.priority} priority
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditingNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Topics: </span>
                        <span className="text-sm text-gray-600">
                          {note.topicsDiscussed.join(', ')}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Progress: </span>
                        <span className="text-sm text-gray-600">{note.progress}</span>
                      </div>

                      {note.nextSteps.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Next Steps: </span>
                          <span className="text-sm text-gray-600">
                            {note.nextSteps.join(', ')}
                          </span>
                        </div>
                      )}

                      {note.followUpDate && (
                        <div>
                          <span className="text-sm font-medium">Follow-up: </span>
                          <span className="text-sm text-gray-600">
                            {new Date(note.followUpDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Progress Goals</h3>
            
            {progressGoals.map((goal: ProgressGoal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                    </div>

                    {goal.milestones.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Milestones: </span>
                        <span className="text-sm text-gray-600">
                          {goal.milestones.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Counseling Sessions</h3>
            
            {upcomingAppointments.map((appointment: any) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.studentName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.scheduledAt).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{appointment.sessionType}</Badge>
                      <p className="text-sm text-gray-600 mt-1">{appointment.duration} minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {upcomingAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming sessions scheduled</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}