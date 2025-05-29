import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Database, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UploadResult {
  success: boolean;
  message?: string;
  errors?: string[];
  processedCount?: number;
  data?: any[];
}

interface PreviewData {
  headers: string[];
  rows: any[][];
  totalRows: number;
}

export default function DataUpload() {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    universities: null,
    programs: null,
    applications: null
  });
  
  const [uploadResults, setUploadResults] = useState<{ [key: string]: UploadResult }>({});
  const [previewData, setPreviewData] = useState<{ [key: string]: PreviewData }>({});
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleFileSelect = async (type: string, file: File | null) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    
    if (file) {
      // Generate preview
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiRequest('POST', `/api/upload/preview-${type}`, formData);
        const preview = await response.json();
        
        setPreviewData(prev => ({ ...prev, [type]: preview }));
      } catch (error) {
        toast({
          title: "Preview Error",
          description: "Could not generate file preview",
          variant: "destructive"
        });
      }
    } else {
      setPreviewData(prev => ({ ...prev, [type]: {} as PreviewData }));
    }
  };

  const handleUpload = async (type: string) => {
    const file = selectedFiles[type];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest('POST', `/api/upload/${type}`, formData);
      const result = await response.json();
      
      setUploadResults(prev => ({ ...prev, [type]: { success: true, ...result } }));
      
      toast({
        title: "Upload Successful",
        description: result.message || `${type} data uploaded successfully`
      });
    } catch (error: any) {
      const errorResult = error.response ? await error.response.json() : { message: 'Upload failed' };
      setUploadResults(prev => ({ ...prev, [type]: { success: false, ...errorResult } }));
      
      toast({
        title: "Upload Failed",
        description: errorResult.message || 'An error occurred during upload',
        variant: "destructive"
      });
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const renderUploadSection = (type: string, title: string, description: string, sampleColumns: string[]) => {
    const file = selectedFiles[type];
    const result = uploadResults[type];
    const preview = previewData[type];
    const uploading = isUploading[type];

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Required columns:</p>
            <div className="flex flex-wrap gap-1">
              {sampleColumns.map(col => (
                <span key={col} className="text-xs bg-muted px-2 py-1 rounded">{col}</span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`${type}-file`}>Select File</Label>
            <Input
              id={`${type}-file`}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => handleFileSelect(type, e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          {preview && preview.headers && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                File Preview ({preview.totalRows} rows)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {preview.headers.slice(0, 6).map((header, i) => (
                        <th key={i} className="text-left p-2 font-medium">{header}</th>
                      ))}
                      {preview.headers.length > 6 && <th className="text-left p-2">...</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b">
                        {row.slice(0, 6).map((cell, j) => (
                          <td key={j} className="p-2 max-w-32 truncate">{cell}</td>
                        ))}
                        {row.length > 6 && <td className="p-2">...</td>}
                      </tr>
                    ))}
                    {preview.rows.length > 3 && (
                      <tr>
                        <td colSpan={Math.min(preview.headers.length, 7)} className="p-2 text-center text-muted-foreground">
                          ... and {preview.totalRows - 3} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result && (
            <div className={`border rounded-lg p-4 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Upload Successful' : 'Upload Failed'}
                </span>
              </div>
              {result.message && (
                <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                  <ul className="text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.slice(0, 10).map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                    {result.errors.length > 10 && (
                      <li>... and {result.errors.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              )}
              {result.processedCount !== undefined && (
                <p className="text-sm text-muted-foreground mt-1">
                  Processed: {result.processedCount} rows
                </p>
              )}
            </div>
          )}

          <Button 
            onClick={() => handleUpload(type)}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {title}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Upload Center</h1>
        <p className="text-muted-foreground mt-2">
          Upload university, program, and application data from spreadsheet files
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Important Notes</h3>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Files should be in CSV, Excel (.xlsx), or Excel (.xls) format</li>
              <li>• Upload universities first, then programs, then applications</li>
              <li>• Programs must reference existing universities by name</li>
              <li>• Applications must reference existing students (by email) and programs</li>
              <li>• All required columns must be present in your files</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="universities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="universities" className="mt-6">
          {renderUploadSection(
            "universities",
            "Universities",
            "Upload university information including basic details and contact information",
            ["name", "country", "city", "website", "type", "ranking"]
          )}
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          {renderUploadSection(
            "programs",
            "Programs",
            "Upload academic programs linked to universities",
            ["name", "universityName", "level", "degree", "discipline", "duration", "tuitionFee"]
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          {renderUploadSection(
            "applications",
            "Applications",
            "Upload student applications linked to programs and students",
            ["studentEmail", "universityName", "programName", "status", "submissionDate", "applicationFee"]
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}