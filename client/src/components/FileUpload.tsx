import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FileUploadProps = {
  email: string;
  onFileUploaded: (url: string, filename: string) => void;
  onFileRemoved?: () => void;
  currentFile?: { url: string; filename: string };
  label: string;
  accept?: string;
  maxSizeMB?: number;
};

export function FileUpload({
  email,
  onFileUploaded,
  onFileRemoved,
  currentFile,
  label,
  accept = ".pdf,.doc,.docx",
  maxSizeMB = 10,
}: FileUploadProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadFileMutation = trpc.intakeFileUpload.uploadFile.useMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to S3
      const result = await uploadFileMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        base64Data,
        email,
      });

      onFileUploaded(result.url, result.filename);
      
      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (onFileRemoved) {
      onFileRemoved();
    }
    toast.success("File has been removed");
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {currentFile ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{currentFile.filename}</p>
              <a
                href={currentFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View file
              </a>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || !email}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !email}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Accepted formats: PDF, DOC, DOCX (max {maxSizeMB}MB)
          </p>
          {!email && (
            <p className="text-xs text-amber-600 mt-1">
              Please enter your email address first
            </p>
          )}
        </div>
      )}
    </div>
  );
}
