import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { STANDARDIZED_TESTS } from "@/lib/utils";
import FileUpload from "./FileUpload";

interface TestEntryProps {
  index: number;
  onRemove: (index: number) => void;
}

const TestEntry: React.FC<TestEntryProps> = ({ index, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Label htmlFor={`test_${index}_name`} className="text-sm font-medium text-gray-700">
            Test/Qualification Name<span className="text-red-500">*</span>
          </Label>
          <Select name={`tests[${index}].testName`} required>
            <SelectTrigger id={`test_${index}_name`} className="mt-1">
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {STANDARDIZED_TESTS.map(test => (
                <SelectItem key={test.value} value={test.value}>
                  {test.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor={`test_${index}_score`} className="text-sm font-medium text-gray-700">
            Score/Grade<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`test_${index}_score`}
            name={`tests[${index}].score`}
            placeholder="Type here..."
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor={`test_${index}_date`} className="text-sm font-medium text-gray-700">
            Date Taken/Awarded<span className="text-red-500">*</span>
          </Label>
          <Input
            id={`test_${index}_date`}
            name={`tests[${index}].dateTaken`}
            type="date"
            className="mt-1"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <FileUpload
            id={`test_${index}_report`}
            name={`tests[${index}].scoreReport`}
            label="Upload Score Report (PDF, JPG <5MB)"
            accept=".pdf,.jpg,.jpeg"
            maxSize={5}
            required={false}
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
          <Trash className="h-4 w-4 mr-1.5" /> Remove Test
        </Button>
      </div>
    </div>
  );
};

export default TestEntry;
