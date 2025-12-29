import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, Download, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CVManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: cvFiles, isLoading } = useQuery({
    queryKey: ["cv-files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("cv-documents")
        .list("", {
          limit: 10,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });
      if (error) throw error;
      return data || [];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `cv_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("cv-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;
      return fileName;
    },
    onSuccess: () => {
      toast({ title: "CV uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["cv-files"] });
      setFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabase.storage
        .from("cv-documents")
        .remove([fileName]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "CV deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["cv-files"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await uploadMutation.mutateAsync(file);
    setUploading(false);
  };

  const handleDownload = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from("cv-documents")
      .download(fileName);
    
    if (error) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from("cv-documents")
      .download(fileName);
    
    if (error) {
      toast({
        title: "Preview failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(data);
    window.open(url, "_blank");
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New CV
          </CardTitle>
          <CardDescription>
            Upload your latest resume/CV document (PDF, DOC, DOCX)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cv-file">Select CV File</Label>
              <Input
                id="cv-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {file.name} ({formatFileSize(file.size)})
                </p>
              )}
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full sm:w-auto"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload CV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing CVs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded CVs
          </CardTitle>
          <CardDescription>
            Manage your uploaded resume documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cvFiles && cvFiles.length > 0 ? (
            <div className="space-y-4">
              {cvFiles.map((file) => (
                <Card key={file.name}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">{file.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {file.metadata?.mimetype || 'Document'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Size: {formatFileSize(file.metadata?.size || 0)}</p>
                          <p>Uploaded: {formatDate(file.created_at)}</p>
                          <p>Last Modified: {formatDate(file.updated_at)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(file.name)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(file.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No CV files uploaded yet</p>
              <p className="text-sm text-muted-foreground">Upload your first CV using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}