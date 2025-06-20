import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  FileText, 
  User, 
  School, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Send,
  Download,
  Filter,
  Search
} from 'lucide-react';
import AdminNavigation from '@/components/AdminNavigation';

interface Application {
  id: number;
  studentId: number;
  programId: number;
  universityId: number;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  notes?: string;
  student: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  program: {
    name: string;
    level: string;
  };
  university: {
    name: string;
    location: string;
  };
  documents: Document[];
}

interface Document {
  id: number;
  applicationId: number;
  type: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  rejectionReason?: string;
}

interface DocumentReviewData {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export default function AdminDashboard() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [documentReview, setDocumentReview] = useState<DocumentReviewData>({
    status: 'approved'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      window.location.href = '/admin-login';
    }
  }, []);

  // Fetch all applications with details
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['/api/admin/applications', statusFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await apiRequest('GET', `/api/admin/applications?${params}`);
      return response;
    }
  });

  // Review document mutation
  const reviewDocumentMutation = useMutation({
    mutationFn: async ({ documentId, reviewData }: { documentId: number; reviewData: DocumentReviewData }) => {
      return apiRequest('PUT', `/api/admin/documents/${documentId}/review`, reviewData);
    },
    onSuccess: () => {
      toast({
        title: "Document Reviewed",
        description: "Document status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/applications'] });
      setSelectedDocument(null);
    },
    onError: (error: any) => {
      toast({
        title: "Review Failed",
        description: error.message || "Failed to review document",
        variant: "destructive",
      });
    }
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, status, notes }: { applicationId: number; status: string; notes?: string }) => {
      return apiRequest('PUT', `/api/admin/applications/${applicationId}/status`, { status, notes });
    },
    onSuccess: () => {
      toast({
        title: "Application Updated",
        description: "Application status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application",
        variant: "destructive",
      });
    }
  });

  // Send to school mutation
  const sendToSchoolMutation = useMutation({
    mutationFn: async ({ applicationId, method }: { applicationId: number; method: 'manual' | 'leadenroll' }) => {
      return apiRequest('POST', `/api/admin/applications/${applicationId}/send-to-school`, { method });
    },
    onSuccess: (data) => {
      toast({
        title: "Application Sent",
        description: data.method === 'manual' 
          ? "Application package prepared for manual upload" 
          : "Application sent to LeadEnroll system",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send application",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      submitted: { variant: "secondary", icon: Clock },
      under_review: { variant: "default", icon: Eye },
      approved: { variant: "default", icon: CheckCircle, className: "bg-green-100 text-green-800" },
      rejected: { variant: "destructive", icon: XCircle },
      sent_to_school: { variant: "default", icon: Send, className: "bg-blue-100 text-blue-800" }
    };
    
    const config = variants[status] || variants.submitted;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ').toUpperCase()}
      </Badge>
    );
  };

  const getDocumentStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", icon: Clock },
      approved: { variant: "default", icon: CheckCircle, className: "bg-green-100 text-green-800" },
      rejected: { variant: "destructive", icon: XCircle }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredApplications = applications.filter((app: Application) => {
    const matchesSearch = searchTerm === '' || 
      app.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      <AdminNavigation 
        activeTab="applications" 
        onTabChange={(tab) => console.log(tab)} 
        pendingCount={filteredApplications.filter(app => app.status === 'submitted').length}
      />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Review applications and manage document approvals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {filteredApplications.length} Applications
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Applications</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by student name, email, program, or university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="status-filter">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="sent_to_school">Sent to School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found matching your criteria</p>
            </div>
          ) : (
            filteredApplications.map((application: Application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                        {application.student.firstName.charAt(0)}{application.student.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {application.student.firstName} {application.student.lastName}
                        </h3>
                        <p className="text-gray-600">{application.student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(application.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Program</h4>
                      <p className="text-sm">{application.program.name}</p>
                      <p className="text-sm text-gray-500">{application.program.level}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">University</h4>
                      <p className="text-sm">{application.university.name}</p>
                      <p className="text-sm text-gray-500">{application.university.location}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Documents</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.documents?.map((doc) => (
                          <span key={doc.id} className="text-xs">
                            {getDocumentStatusBadge(doc.status)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <ApplicationDetailModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onDocumentReview={(doc) => setSelectedDocument(doc)}
            onStatusUpdate={(applicationId, status, notes) => 
              updateApplicationMutation.mutate({ applicationId, status, notes })
            }
            onSendToSchool={(applicationId, method) => 
              sendToSchoolMutation.mutate({ applicationId, method })
            }
          />
        )}

        {/* Document Review Modal */}
        {selectedDocument && (
          <DocumentReviewModal
            document={selectedDocument}
            reviewData={documentReview}
            onReviewDataChange={setDocumentReview}
            onClose={() => setSelectedDocument(null)}
            onSubmit={() => 
              reviewDocumentMutation.mutate({ 
                documentId: selectedDocument.id, 
                reviewData: documentReview 
              })
            }
            isSubmitting={reviewDocumentMutation.isPending}
          />
        )}
        </div>
      </div>
    </div>
  );
}

// Application Detail Modal Component
function ApplicationDetailModal({
  application,
  onClose,
  onDocumentReview,
  onStatusUpdate,
  onSendToSchool
}: {
  application: Application;
  onClose: () => void;
  onDocumentReview: (doc: Document) => void;
  onStatusUpdate: (applicationId: number, status: string, notes?: string) => void;
  onSendToSchool: (applicationId: number, method: 'manual' | 'leadenroll') => void;
}) {
  const [newStatus, setNewStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Application Review - {application.student.firstName} {application.student.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Student Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Student Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {application.student.firstName} {application.student.lastName}</p>
                  <p><strong>Email:</strong> {application.student.email}</p>
                  <p><strong>Phone:</strong> {application.student.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Program Information</h3>
                <div className="space-y-2">
                  <p><strong>Program:</strong> {application.program.name}</p>
                  <p><strong>Level:</strong> {application.program.level}</p>
                  <p><strong>University:</strong> {application.university.name}</p>
                  <p><strong>Location:</strong> {application.university.location}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Application Timeline</h3>
              <div className="space-y-2">
                <p><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
                {application.reviewedAt && (
                  <p><strong>Last Reviewed:</strong> {new Date(application.reviewedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="grid gap-4">
              {application.documents?.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{document.type}</h4>
                          <p className="text-sm text-gray-600">{document.fileName}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getDocumentStatusBadge(document.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDocumentReview(document)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                    {document.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Rejection Reason:</strong> {document.rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Update Application Status</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="sent_to_school">Sent to School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={() => onStatusUpdate(application.id, newStatus, notes)}
                  className="w-full"
                >
                  Update Status
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Send to School</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => onSendToSchool(application.id, 'manual')}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Prepare for Manual Upload
                </Button>
                <Button
                  onClick={() => onSendToSchool(application.id, 'leadenroll')}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to LeadEnroll System
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Document Review Modal Component
function DocumentReviewModal({
  document,
  reviewData,
  onReviewDataChange,
  onClose,
  onSubmit,
  isSubmitting
}: {
  document: Document;
  reviewData: DocumentReviewData;
  onReviewDataChange: (data: DocumentReviewData) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Document: {document.type}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">File: {document.fileName}</p>
            <Button
              variant="outline"
              onClick={() => window.open(document.fileUrl, '_blank')}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Document
            </Button>
          </div>
          
          <div>
            <Label htmlFor="review-status">Review Decision</Label>
            <Select
              value={reviewData.status}
              onValueChange={(value: 'approved' | 'rejected') =>
                onReviewDataChange({ ...reviewData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approve</SelectItem>
                <SelectItem value="rejected">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {reviewData.status === 'rejected' && (
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={reviewData.rejectionReason || ''}
                onChange={(e) =>
                  onReviewDataChange({ ...reviewData, rejectionReason: e.target.value })
                }
                placeholder="Please specify why this document is being rejected..."
                rows={3}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getDocumentStatusBadge(status: string) {
  const variants: Record<string, any> = {
    pending: { variant: "secondary", icon: Clock },
    approved: { variant: "default", icon: CheckCircle, className: "bg-green-100 text-green-800" },
    rejected: { variant: "destructive", icon: XCircle }
  };
  
  const config = variants[status] || variants.pending;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {status.toUpperCase()}
    </Badge>
  );
}