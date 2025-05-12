import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureProps {
  initialImage?: string | null;
  onImageChange?: (file: File) => void;
}

const ProfilePicture = ({ initialImage, onImageChange }: ProfilePictureProps) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const { toast } = useToast();
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef[0]?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Send file to parent component
    if (onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <div className="relative" onClick={handleImageClick}>
      <div 
        className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow cursor-pointer hover:opacity-80 transition"
      >
        {image ? (
          <img 
            src={image} 
            alt="Profile" 
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
      
      <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 shadow-sm border border-white cursor-pointer">
        <Camera className="h-3 w-3 text-white" />
      </div>
      
      <input
        type="file"
        ref={(input) => (fileInputRef[0] = input)}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePicture;
