"use client";

import { FC } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
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
            <User size={16} className="text-default-400" />
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <Tooltip content="Delete">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              aria-label="Delete user"
              onPress={() => onDeleteClick(user)}
            >
              <Trash2 size={16} />
            </Button>
          </Tooltip>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} className="text-default-400" />
          <p className="text-default-600 truncate">{user.email}</p>
        </div>

        {/* User ID */}
        <p className="text-xs text-default-400 truncate">ID: {user.id}</p>
      </div>
    </AdminCard>
  );
};

export default UserManagementCard;
