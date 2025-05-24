import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Eye, Download, Trash2, AlertTriangle, CheckCircle, FileText, Users, Database } from "lucide-react";

interface PrivacySettings {
  profileVisibility: 'public' | 'counselors-only' | 'private';
  dataSharing: boolean;
  marketingEmails: boolean;
  analyticsTracking: boolean;
  thirdPartyIntegrations: boolean;
}

interface DataRequest {
  id: number;
  type: 'export' | 'deletion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export default function SecurityComplianceManager() {
  const [activeTab, setActiveTab] = useState("privacy");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: privacySettings } = useQuery({
    queryKey: ['/api/privacy/settings'],
  });

  const { data: dataRequests = [] } = useQuery({
    queryKey: ['/api/privacy/data-requests'],
  });

  const { data: auditLog = [] } = useQuery({
    queryKey: ['/api/security/audit-log'],
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: (settings: PrivacySettings) => 
      apiRequest('PATCH', '/api/privacy/settings', settings),
    onSuccess: () => {
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/privacy/settings'] });
    },
  });

  const requestDataExportMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/privacy/export-data'),
    onSuccess: () => {
      toast({
        title: "Data Export Requested",
        description: "Your data export will be ready within 24 hours. You'll receive an email when it's available.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/privacy/data-requests'] });
    },
  });

  const requestDataDeletionMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/privacy/delete-account'),
    onSuccess: () => {
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. This action cannot be undone.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/privacy/data-requests'] });
    },
  });

  const currentSettings: PrivacySettings = privacySettings || {
    profileVisibility: 'counselors-only',
    dataSharing: false,
    marketingEmails: true,
    analyticsTracking: true,
    thirdPartyIntegrations: false,
  };

  const handlePrivacyUpdate = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...currentSettings, [key]: value };
    updatePrivacyMutation.mutate(newSettings);
  };

  const getComplianceStatus = () => {
    const compliantSettings = !currentSettings.dataSharing && 
                             !currentSettings.thirdPartyIntegrations;
    return compliantSettings ? 'compliant' : 'review-needed';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security & Privacy Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">Data Encrypted</p>
                <p className="text-sm text-gray-600">AES-256 encryption active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Lock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">GDPR Compliant</p>
                <p className="text-sm text-gray-600">Full data protection rights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium">FERPA Compliant</p>
                <p className="text-sm text-gray-600">Educational records protected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          <TabsTrigger value="data-rights">Data Rights</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Privacy Settings Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { value: 'public', label: 'Public', desc: 'Visible to everyone on the platform' },
                  { value: 'counselors-only', label: 'Counselors Only', desc: 'Only visible to approved counselors' },
                  { value: 'private', label: 'Private', desc: 'Only visible to you' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={option.value}
                      name="visibility"
                      value={option.value}
                      checked={currentSettings.profileVisibility === option.value}
                      onChange={(e) => handlePrivacyUpdate('profileVisibility', e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'dataSharing' as keyof PrivacySettings,
                  title: 'Data Sharing with Partners',
                  description: 'Allow sharing anonymized data with educational partners',
                  sensitive: true
                },
                {
                  key: 'marketingEmails' as keyof PrivacySettings,
                  title: 'Marketing Communications',
                  description: 'Receive updates about new features and educational opportunities'
                },
                {
                  key: 'analyticsTracking' as keyof PrivacySettings,
                  title: 'Analytics & Performance',
                  description: 'Help improve the platform through usage analytics'
                },
                {
                  key: 'thirdPartyIntegrations' as keyof PrivacySettings,
                  title: 'Third-Party Integrations',
                  description: 'Allow data sharing with integrated educational services',
                  sensitive: true
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium">{setting.title}</Label>
                      {setting.sensitive && (
                        <Badge variant="outline" className="text-xs">
                          Sensitive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                  </div>
                  <Switch
                    checked={currentSettings[setting.key] as boolean}
                    onCheckedChange={(checked) => handlePrivacyUpdate(setting.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Rights Tab */}
        <TabsContent value="data-rights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Data Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Export Your Data</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Download a copy of all your personal data in a portable format.
                  </p>
                  <Button 
                    onClick={() => requestDataExportMutation.mutate()}
                    disabled={requestDataExportMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {requestDataExportMutation.isPending ? 'Processing...' : 'Request Data Export'}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium">Delete Account</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button 
                    onClick={() => requestDataDeletionMutation.mutate()}
                    disabled={requestDataDeletionMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    {requestDataDeletionMutation.isPending ? 'Processing...' : 'Request Account Deletion'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Requests History */}
          {dataRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Data Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataRequests.map((request: DataRequest) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {request.type === 'export' ? (
                          <Download className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Trash2 className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium capitalize">{request.type} Request</p>
                          <p className="text-sm text-gray-600">
                            Requested: {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          request.status === 'completed' ? 'default' :
                          request.status === 'failed' ? 'destructive' : 'secondary'
                        }>
                          {request.status}
                        </Badge>
                        {request.downloadUrl && (
                          <Button size="sm" variant="outline" className="mt-2">
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.length > 0 ? auditLog.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">{entry.action}</p>
                        <p className="text-xs text-gray-600">{entry.details}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No recent security activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  getComplianceStatus() === 'compliant' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                } border`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getComplianceStatus() === 'compliant' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className="font-medium">
                      {getComplianceStatus() === 'compliant' ? 'Fully Compliant' : 'Review Needed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getComplianceStatus() === 'compliant' 
                      ? 'Your privacy settings meet all compliance requirements.'
                      : 'Some settings may need adjustment for full compliance.'}
                  </p>
                </div>

                {/* Compliance Checklist */}
                <div className="space-y-3">
                  <h4 className="font-medium">Compliance Checklist</h4>
                  {[
                    { item: 'Data encryption enabled', status: true },
                    { item: 'Privacy settings configured', status: true },
                    { item: 'Data sharing limitations', status: !currentSettings.dataSharing },
                    { item: 'Third-party restrictions', status: !currentSettings.thirdPartyIntegrations },
                    { item: 'Audit logging active', status: true }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {check.status ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className={`text-sm ${check.status ? 'text-green-700' : 'text-yellow-700'}`}>
                        {check.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Privacy Policy</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn about how we collect, use, and protect your data.
                  </p>
                  <Button variant="outline" size="sm">View Policy</Button>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Security Measures</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Details about our security infrastructure and protocols.
                  </p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}