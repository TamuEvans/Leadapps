import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description,
  children,
  actions,
  className,
}) => {
  return (
    <Card className={cn("mb-6 shadow-sm overflow-hidden", className)}>
      <CardHeader className="px-5 py-4 border-b border-gray-200 bg-white flex justify-between items-start">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="p-5 bg-white">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
