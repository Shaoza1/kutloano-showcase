import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Download, Upload } from "lucide-react";

export default function StorageInstructions() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Certificate Storage Instructions
        </CardTitle>
        <CardDescription>
          How to make your certificates permanent across browser sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Download className="h-4 w-4" />
          <AlertDescription>
            <strong>Automatic Backup:</strong> When you add certificates, a courses.json file will automatically download. 
            Save this file to keep your certificates permanently.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            <strong>Permanent Storage:</strong> Place the downloaded courses.json file in the public/data/ folder 
            of your project to make certificates persist across all browser sessions.
          </AlertDescription>
        </Alert>
        
        <div className="text-sm text-muted-foreground">
          <p><strong>Current Storage:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Certificates are stored in browser localStorage (temporary)</li>
            <li>PDF files are converted to base64 format for storage</li>
            <li>Certificates display as preview images in the portfolio</li>
            <li>Download the backup file to make storage permanent</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}