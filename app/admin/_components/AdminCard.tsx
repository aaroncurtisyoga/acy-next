import { FC, ReactNode } from "react";
import { Card, CardBody } from "@heroui/card";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
}

const AdminCard: FC<AdminCardProps> = ({ children, className = "" }) => {
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardBody className="p-4">{children}</CardBody>
    </Card>
  );
};

export default AdminCard;
