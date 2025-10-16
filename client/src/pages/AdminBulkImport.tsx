import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function AdminBulkImport() {
  const [universityFile, setUniversityFile] = useState<File | null>(null);
  const [programFile, setProgramFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUniversityUpload = async () => {
    if (!universityFile) {
      toast({ title: "Error", description: "Please select a file first", variant: "destructive" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', universityFile);

    try {
      const response = await fetch('/api/bulk-import/universities', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Import failed');
      }

      toast({ 
        title: "Success", 
        description: `Imported ${data.count} universities successfully` 
      });
      
      setUniversityFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to import universities", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProgramUpload = async () => {
    if (!programFile) {
      toast({ title: "Error", description: "Please select a file first", variant: "destructive" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', programFile);

    try {
      const response = await fetch('/api/bulk-import/programs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Import failed');
      }

      toast({ 
        title: "Success", 
        description: `Imported ${data.count} programs successfully` 
      });
      
      setProgramFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/programs'] });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to import programs", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async (type: 'universities' | 'programs') => {
    try {
      const response = await fetch(`/api/bulk-import/templates/${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_template.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: "Success", description: `Template downloaded successfully` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download template", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-bulk-import">Bulk Import</h1>
        <p className="text-muted-foreground mt-2">Import universities and programs in bulk using CSV or Excel files</p>
      </div>

      <Tabs defaultValue="universities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        {/* Universities Import */}
        <TabsContent value="universities">
          <Card>
            <CardHeader>
              <CardTitle>Import Universities</CardTitle>
              <CardDescription>
                Upload a CSV or Excel file containing university data. Download the template to see the required format.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => downloadTemplate('universities')}
                  data-testid="button-download-uni-template"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {universityFile ? universityFile.name : "No file selected"}
                  </p>
                  <input
                    type="file"
                    id="university-file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setUniversityFile(e.target.files?.[0] || null)}
                    className="hidden"
                    data-testid="input-university-file"
                  />
                  <label htmlFor="university-file">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </span>
                    </Button>
                  </label>
                </div>

                <div>
                  <Button 
                    onClick={handleUniversityUpload} 
                    disabled={!universityFile || uploading}
                    data-testid="button-upload-universities"
                  >
                    {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Import Universities
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Required Fields:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>name</strong>: University name</li>
                  <li>• <strong>country</strong>: Country location</li>
                  <li>• <strong>city</strong>: City location</li>
                </ul>
                
                <h4 className="font-semibold mt-4 mb-2">Optional Fields:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• locations, images, overview, founded, institutionType</li>
                  <li>• features, avgCostOfLiving, tuitionMin, tuitionMax</li>
                  <li>• topDisciplines, programLevels, logoUrl, websiteUrl</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Import */}
        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Import Programs</CardTitle>
              <CardDescription>
                Upload a CSV or Excel file containing program data. Make sure universities are imported first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => downloadTemplate('programs')}
                  data-testid="button-download-prog-template"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {programFile ? programFile.name : "No file selected"}
                  </p>
                  <input
                    type="file"
                    id="program-file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setProgramFile(e.target.files?.[0] || null)}
                    className="hidden"
                    data-testid="input-program-file"
                  />
                  <label htmlFor="program-file">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </span>
                    </Button>
                  </label>
                </div>

                <div>
                  <Button 
                    onClick={handleProgramUpload} 
                    disabled={!programFile || uploading}
                    data-testid="button-upload-programs"
                  >
                    {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Import Programs
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Required Fields:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>universityId</strong>: ID of the university (must exist)</li>
                  <li>• <strong>name</strong>: Program name</li>
                  <li>• <strong>degree</strong>: Degree type</li>
                  <li>• <strong>level</strong>: Program level (Undergraduate, Graduate, etc.)</li>
                  <li>• <strong>discipline</strong>: Academic discipline</li>
                </ul>
                
                <h4 className="font-semibold mt-4 mb-2">Optional Fields:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• images, summary, duration, tuitionFee, avgLivingExpenses</li>
                  <li>• applicationFee, admissionRequirements, intakes</li>
                  <li>• similarPrograms, description</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Import Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Step 1: Prepare Your Data</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Download the template file</li>
                <li>2. Fill in your data following the format</li>
                <li>3. Save as CSV or Excel (.xlsx)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Step 2: Import in Order</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Import universities first</li>
                <li>2. Note the university IDs created</li>
                <li>3. Import programs with correct university IDs</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💡 Tips for Success:</h4>
            <ul className="text-sm space-y-1">
              <li>• Use comma-separated values for array fields (e.g., &quot;Fall, Spring, Summer&quot;)</li>
              <li>• JSON fields should be properly formatted (e.g., {`{"gpa": 3.0}`})</li>
              <li>• Keep file size under 10MB for best performance</li>
              <li>• Verify your data before uploading to avoid errors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
