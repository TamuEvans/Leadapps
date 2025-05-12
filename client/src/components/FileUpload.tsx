import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  maxSize?: number; // in MB
  required?: boolean;
  onChange?: (file: File | null) => void;
  initialFilename?: string;
  className?: string;
}

const FileUpload = ({
  id,
  label,
  accept,
  maxSize = 5, // Default 5MB
  required = false,
  onChange,
  initialFilename,
  className,
}: FileUploadProps) => {
  const [filename, setFilename] = useState<string | null>(initialFilename || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setFilename(null);
      if (onChange) onChange(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select a file under ${maxSize}MB`,
        variant: "destructive",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Set filename and call onChange
    setFilename(file.name);
    if (onChange) onChange(file);
  };

  const removeFile = () => {
    setFilename(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center">
        <label htmlFor={id} className="cursor-pointer flex-1">
          <div className="border border-gray-300 rounded-md py-2 px-3 text-sm flex items-center justify-between overflow-hidden">
            <span className="text-gray-500 truncate">{filename || "Choose File"}</span>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              className="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded text-xs font-medium text-gray-700"
            >
              Browse
            </Button>
          </div>
          <input
            type="file"
            id={id}
            name={id}
            className="hidden"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label>
        {filename && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-3 text-gray-400 hover:text-gray-500"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
