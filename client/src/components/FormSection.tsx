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
    <Card className={cn("mb-8 rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden", className)}>
      <CardHeader className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50 flex justify-between items-start">
        <div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</CardTitle>
          {description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="p-6 bg-white/50 backdrop-blur-sm">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
