import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { COUNTRIES } from "@/lib/utils";

interface WorkEntryProps {
  index: number;
  onRemove: (index: number) => void;
}

const WorkEntry: React.FC<WorkEntryProps> = ({ index, onRemove }) => {
  const [isCurrentJob, setIsCurrentJob] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Label htmlFor={`work_${index}_title`} className="text-sm font-medium text-gray-700">
            Job Title<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`work_${index}_title`}
            name={`workExperiences[${index}].jobTitle`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`work_${index}_company`} className="text-sm font-medium text-gray-700">
            Company/Organization<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`work_${index}_company`}
            name={`workExperiences[${index}].company`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`work_${index}_location`} className="text-sm font-medium text-gray-700">
            Location<span className="text-red-500">*</span>
          </Label>
          <Select name={`workExperiences[${index}].country`} required>
            <SelectTrigger id={`work_${index}_location`} className="mt-1">
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
          <Label htmlFor={`work_${index}_city`} className="text-sm font-medium text-gray-700">
            City<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`work_${index}_city`}
            name={`workExperiences[${index}].city`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`work_${index}_startDate`} className="text-sm font-medium text-gray-700">
            Start Date<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`work_${index}_startDate`}
            name={`workExperiences[${index}].startDate`}
            type="month"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`work_${index}_endDate`} className="text-sm font-medium text-gray-700">
            End Date<span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <Input
              id={`work_${index}_endDate`}
              name={`workExperiences[${index}].endDate`}
              type="month"
              className="mt-1"
              required={!isCurrentJob}
              disabled={isCurrentJob}
            />
            <div className="ml-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`work_${index}_current`}
                  name={`workExperiences[${index}].current`}
                  checked={isCurrentJob}
                  onCheckedChange={(checked) => {
                    setIsCurrentJob(checked as boolean);
                  }}
                />
                <Label htmlFor={`work_${index}_current`} className="text-sm text-gray-700">
                  Current Job
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor={`work_${index}_description`} className="text-sm font-medium text-gray-700">
            Job Description
          </Label>
          <Textarea
            id={`work_${index}_description`}
            name={`workExperiences[${index}].description`}
            placeholder="Describe your responsibilities and achievements..."
            className="mt-1 min-h-[100px]"
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
          <Trash className="h-4 w-4 mr-1.5" /> Remove Experience
        </Button>
      </div>
    </div>
  );
};

export default WorkEntry;
