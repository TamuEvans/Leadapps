import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children,
  actions,
  className,
}) => {
  return (
    <Card className={cn("mb-6 shadow-sm overflow-hidden", className)}>
      <CardHeader className="px-5 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="p-5 bg-white">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
