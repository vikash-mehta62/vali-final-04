
import React, { useState } from 'react';
import { Upload, X, Image, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {imageUpload} from "@/services2/operations/image"


interface MediaUploaderProps {
  onUpload: (files: string[]) => void;
  initialFiles?: string[];
  acceptedTypes?: string;
  maxFiles?: number;
  className?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  initialFiles = [],
  acceptedTypes = "image/*,video/*",
  maxFiles = 5,
  className
}) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    if (files.length + e.target.files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files`,
        variant: "destructive"
      });
      return;
    }
  
    setIsUploading(true);
  
    try {
      // ✅ Upload images to server (Cloudinary or wherever)
      const uploadedUrls = await imageUpload(Array.from(e.target.files));
  
      const updatedFiles = [...files, ...uploadedUrls];
      setFiles(updatedFiles);
      onUpload(updatedFiles);
  
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} files`,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
          isLoading={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-sm text-muted-foreground">
          {files.length}/{maxFiles} files uploaded
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="relative border rounded-md overflow-hidden h-24 group"
            >
              {isImage(file) ? (
                <img
                  src={file}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <FileVideo className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {isImage(file) ? (
                <Image className="absolute bottom-1 left-1 h-4 w-4 text-white drop-shadow-md" />
              ) : (
                <FileVideo className="absolute bottom-1 left-1 h-4 w-4 text-white drop-shadow-md" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
