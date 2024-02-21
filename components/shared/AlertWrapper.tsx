import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReactNode } from "react";

interface AlertWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  variant?: "default" | "destructive" | "success";
}
export const AlertWrapper = ({
  children,
  title,
  description,
  variant = "default",
}: AlertWrapperProps) => {
  return (
    <Alert variant={variant}>
      {children}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
