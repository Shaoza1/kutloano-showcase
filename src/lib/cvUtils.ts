import { supabase } from "@/integrations/supabase/client";

export const downloadLatestCV = async () => {
  try {
    // Get the latest CV file from storage
    const { data: files, error: listError } = await supabase.storage
      .from("cv-documents")
      .list("", {
        limit: 1,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (listError) throw listError;
    
    if (!files || files.length === 0) {
      throw new Error("No CV files found");
    }

    const latestFile = files[0];
    
    // Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("cv-documents")
      .download(latestFile.name);

    if (downloadError) throw downloadError;

    // Create download link
    const url = URL.createObjectURL(fileData);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kutloano_Moshao_CV.${latestFile.name.split('.').pop()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("CV download error:", error);
    throw error;
  }
};