import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { COUNTRIES, EDUCATION_LEVELS } from "@/lib/utils";
import FileUpload from "./FileUpload";

interface SchoolEntryProps {
  index: number;
  onRemove: (index: number) => void;
}

const SchoolEntry: React.FC<SchoolEntryProps> = ({ index, onRemove }) => {
  const [isCurrentlyAttending, setIsCurrentlyAttending] = React.useState(false);
  
  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Label htmlFor={`school_${index}_name`} className="text-sm font-medium text-gray-700">
            Institution Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`school_${index}_name`}
            name={`schools[${index}].name`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_country`} className="text-sm font-medium text-gray-700">
            Country<span className="text-red-500">*</span>
          </Label>
          <Select name={`schools[${index}].country`} required>
            <SelectTrigger id={`school_${index}_country`} className="mt-1">
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_city`} className="text-sm font-medium text-gray-700">
            City/Town<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`school_${index}_city`}
            name={`schools[${index}].city`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_level`} className="text-sm font-medium text-gray-700">
            Level of Study<span className="text-red-500">*</span>
          </Label>
          <Select name={`schools[${index}].level`} required>
            <SelectTrigger id={`school_${index}_level`} className="mt-1">
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_degree`} className="text-sm font-medium text-gray-700">
            Degree/Diploma<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`school_${index}_degree`}
            name={`schools[${index}].degree`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_major`} className="text-sm font-medium text-gray-700">
            Major
          </Label>
          <Input
            id={`school_${index}_major`}
            name={`schools[${index}].major`}
            placeholder="Type here..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_fromDate`} className="text-sm font-medium text-gray-700">
            From Date<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`school_${index}_fromDate`}
            name={`schools[${index}].fromDate`}
            type="month"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_toDate`} className="text-sm font-medium text-gray-700">
            To Date<span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <Input
              id={`school_${index}_toDate`}
              name={`schools[${index}].toDate`}
              type="month"
              className="mt-1"
              required={!isCurrentlyAttending}
              disabled={isCurrentlyAttending}
            />
            <div className="ml-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`school_${index}_currentlyAttending`}
                  name={`schools[${index}].currentlyAttending`}
                  checked={isCurrentlyAttending}
                  onCheckedChange={(checked) => {
                    setIsCurrentlyAttending(checked as boolean);
                  }}
                />
                <Label htmlFor={`school_${index}_currentlyAttending`} className="text-sm text-gray-700">
                  Currently Attending
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor={`school_${index}_graduationDate`} className="text-sm font-medium text-gray-700">
            Graduation Date (or Expected)<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`school_${index}_graduationDate`}
            name={`schools[${index}].graduationDate`}
            type="month"
            className="mt-1"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <FileUpload
            id={`school_${index}_transcript`}
            name={`schools[${index}].transcript`}
            label="Upload Transcript (PDF, JPG, PNG <5MB)"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5}
            required
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          className="border-red-500 text-red-600 hover:bg-red-50"
          onClick={() => onRemove(index)}
        >
          <Trash className="h-4 w-4 mr-1.5" /> Remove School
        </Button>
      </div>
    </div>
  );
};

export default SchoolEntry;
