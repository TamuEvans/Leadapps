import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTRIES } from "@/lib/utils";

interface AddressFormProps {
  type: 'current' | 'permanent';
  formPrefix: string;
  required?: boolean;
  showPermanentAddressToggle?: boolean;
  isPermanentAddressDifferent?: boolean;
  onPermanentAddressToggle?: (checked: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  formPrefix,
  required = true,
  showPermanentAddressToggle = false,
  isPermanentAddressDifferent = false,
  onPermanentAddressToggle,
}) => {
  const titleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-4">
      {type === 'current' && showPermanentAddressToggle && (
        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="differentPermanentAddress" 
              checked={isPermanentAddressDifferent}
              onCheckedChange={(checked) => {
                if (onPermanentAddressToggle) {
                  onPermanentAddressToggle(checked as boolean);
                }
              }} 
            />
            <Label htmlFor="differentPermanentAddress" className="text-sm text-gray-700">
              Permanent Address is different from Current Address
            </Label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2">
          <Label htmlFor={`${formPrefix}address1`} className="text-sm font-medium text-gray-700">
            Address
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={`${formPrefix}address1`}
            name={`${formPrefix}address1`}
            placeholder="Type street address, P.O. box..."
            className="mt-1"
            required={required}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor={`${formPrefix}address2`} className="text-sm font-medium text-gray-700">
            Address Line 2
          </Label>
          <Input
            id={`${formPrefix}address2`}
            name={`${formPrefix}address2`}
            placeholder="Type apt, suite, unit..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor={`${formPrefix}city`} className="text-sm font-medium text-gray-700">
            City/Town
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={`${formPrefix}city`}
            name={`${formPrefix}city`}
            placeholder="Type here..."
            className="mt-1"
            required={required}
          />
        </div>
        
        <div>
          <Label htmlFor={`${formPrefix}province`} className="text-sm font-medium text-gray-700">
            Province/State/Parish
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={`${formPrefix}province`}
            name={`${formPrefix}province`}
            placeholder="Type here..."
            className="mt-1"
            required={required}
          />
        </div>
        
        <div>
          <Label htmlFor={`${formPrefix}country`} className="text-sm font-medium text-gray-700">
            Country
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Select name={`${formPrefix}country`} required={required}>
            <SelectTrigger id={`${formPrefix}country`} className="mt-1">
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
          <Label htmlFor={`${formPrefix}postalCode`} className="text-sm font-medium text-gray-700">
            Postal Code
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={`${formPrefix}postalCode`}
            name={`${formPrefix}postalCode`}
            placeholder="Type here..."
            className="mt-1"
            required={required}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
