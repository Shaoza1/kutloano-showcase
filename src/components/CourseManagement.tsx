import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, FileText, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { saveCourseData, loadCourseData } from "@/lib/courseData";
import StorageInstructions from "./StorageInstructions";

interface CourseFormProps {
  course?: any;
  onSuccess: () => void;
}

function CourseForm({ course, onSuccess }: CourseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: course || {
      title: "",
      subtitle: "",
      description: "",
      provider: "",
      course_type: "",
      completion_date: "",
      duration: "",
      skills_learned: [],
      is_featured: false,
      is_published: true,
    },
  });

  const uploadDocument = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    
    // Try Supabase upload first if authenticated
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email === 'kutloano.moshao111@gmail.com') {
        const filePath = `courses/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("course-documents")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!uploadError) {
          console.log('✅ File uploaded to Supabase storage');
          return { filePath, fileName: file.name, fileData: null };
        }
      }
    } catch (error) {
      console.warn('Supabase upload failed, using base64:', error);
    }
    
    // Fallback to base64 for permanent local storage
    return new Promise<{ filePath: string; fileName: string; fileData: string }>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('💾 File converted to base64 for local storage');
        resolve({
          filePath: fileName,
          fileName: file.name,
          fileData: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let documentData = {};

      if (file) {
        setUploading(true);
        try {
          const { filePath, fileName, fileData } = await uploadDocument(file);
          documentData = {
            document_url: filePath,
            document_name: fileName,
            document_type: file.name.split(".").pop(),
            document_size: file.size,
          };
          
          // Only add base64 data if we're using local storage
          if (fileData) {
            documentData.document_data = fileData;
          }
        } catch (error) {
          console.warn('File upload failed, continuing without file');
        }
        setUploading(false);
      }

      const submitData = {
        ...data,
        ...documentData,
        id: course?.id || Date.now().toString(),
        skills_learned: Array.isArray(data.skills_learned) 
          ? data.skills_learned 
          : data.skills_learned?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
      };

      // Try Supabase first if authenticated
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email === 'kutloano.moshao111@gmail.com') {
          if (course) {
            const { error } = await supabase
              .from("portfolio_courses")
              .update(submitData)
              .eq("id", course.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from("portfolio_courses")
              .insert(submitData);
            if (error) throw error;
          }
          console.log('✅ Saved to Supabase successfully');
          return; // Success, exit early
        }
      } catch (error) {
        console.warn('Supabase save failed, using local storage:', error);
      }
      // Fallback to local storage
      const existingCourses = await loadCourseData();
      let updatedCourses;
      
      if (course) {
        const index = existingCourses.findIndex((c: any) => c.id === course.id);
        if (index !== -1) {
          existingCourses[index] = submitData;
        }
        updatedCourses = existingCourses;
      } else {
        updatedCourses = [...existingCourses, submitData];
      }
      
      saveCourseData(updatedCourses);
      console.log('💾 Saved to local storage with JSON backup');
    },
    onSuccess: () => {
      toast({ title: `Course ${course ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      onSuccess();
      reset();
      setFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title", { required: "Title is required" })} />
          {errors.title?.message && (
            <p className="text-destructive text-sm mt-1">{String(errors.title.message)}</p>
          )}
        </div>
        <div>
          <Label htmlFor="provider">Provider *</Label>
          <Input 
            id="provider" 
            placeholder="e.g., WSO2, CISCO, Coursera" 
            {...register("provider", { required: "Provider is required" })} 
          />
          {errors.provider?.message && (
            <p className="text-destructive text-sm mt-1">{String(errors.provider.message)}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" {...register("subtitle")} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="course_type">Course Type</Label>
          <Input 
            id="course_type" 
            placeholder="e.g., Certification, Lab, Project" 
            {...register("course_type")} 
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input 
            id="duration" 
            placeholder="e.g., 3 months, 40 hours" 
            {...register("duration")} 
          />
        </div>
      </div>

      <div>
        <Label htmlFor="completion_date">Completion Date</Label>
        <Input type="date" id="completion_date" {...register("completion_date")} />
      </div>

      <div>
        <Label htmlFor="skills_learned">Skills Learned (comma-separated)</Label>
        <Textarea 
          id="skills_learned" 
          placeholder="e.g., API Management, Network Security, Python"
          {...register("skills_learned")} 
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="document">Course Document (PDF, DOCX, PPTX)</Label>
        <Input
          type="file"
          id="document"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
        {course?.document_name && !file && (
          <p className="text-sm text-muted-foreground mt-1">
            Current: {course.document_name}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="is_featured"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Published</Label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || uploading}>
        {(isSubmitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {course ? "Update Course" : "Add Course"}
      </Button>
    </form>
  );
}

export default function CourseManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_courses")
          .select("*")
          .order("completion_date", { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (error) {
        // Fallback to our data utility
        return await loadCourseData();
      }
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StorageInstructions />
      <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Courses & Labs</CardTitle>
          <CardDescription>Add course reports, lab work, and professional development materials</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-courses"] })} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses?.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      {course.is_featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                      {!course.is_published && (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                    </div>
                    <p className="text-sm text-accent font-medium mb-1">{course.provider}</p>
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2">{course.subtitle}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.course_type && (
                        <Badge variant="secondary" className="text-xs">
                          {course.course_type}
                        </Badge>
                      )}
                      {course.skills_learned?.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {course.document_url && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{course.document_name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const url = `${SUPABASE_URL}/storage/v1/object/public/course-documents/${course.document_url}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Course</DialogTitle>
                        </DialogHeader>
                        <CourseForm
                          course={course}
                          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-courses"] })}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCourseMutation.mutate(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!courses || courses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No courses added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}