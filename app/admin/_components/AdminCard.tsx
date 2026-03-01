import { FC, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
}

const AdminCard: FC<AdminCardProps> = ({ children, className = "" }) => {
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
};

export default AdminCard;
