"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { Trash2, Mail, User } from "lucide-react";
import AdminCard from "@/app/admin/_components/AdminCard";

interface UserManagementCardProps {
  user: any;
  onDeleteClick: (user: any) => void;
}

const UserManagementCard: FC<UserManagementCardProps> = ({
  user,
  onDeleteClick,
}) => {
  return (
    <AdminCard>
      <div className="space-y-2">
        {/* Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <SimpleTooltip content="Delete">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              aria-label="Delete user"
              onClick={() => onDeleteClick(user)}
            >
              <Trash2 size={16} />
            </Button>
          </SimpleTooltip>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} className="text-muted-foreground" />
          <p className="text-muted-foreground truncate">{user.email}</p>
        </div>

        {/* User ID */}
        <p className="text-xs text-muted-foreground truncate">ID: {user.id}</p>
      </div>
    </AdminCard>
  );
};

export default UserManagementCard;
