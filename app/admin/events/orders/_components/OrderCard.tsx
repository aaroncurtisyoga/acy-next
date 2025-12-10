"use client";

import { FC } from "react";
import { Calendar, DollarSign, User, Ticket } from "lucide-react";
import { Order, User as PrismaUser, Event } from "@prisma/client";
import AdminCard from "@/app/admin/_components/AdminCard";
import { formatDateTime, formatPrice } from "@/app/_lib/utils";

type OrderWithEventFieldsAndUserFields = Order & {
  event: Pick<Event, "title">;
  buyer: Pick<PrismaUser, "firstName" | "lastName">;
};

interface OrderCardProps {
  order: OrderWithEventFieldsAndUserFields;
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  return (
    <AdminCard>
      <div className="space-y-2">
        {/* Event title */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Ticket size={16} className="text-default-400 flex-shrink-0" />
            <p className="font-medium truncate">{order.event.title}</p>
          </div>
          <div className="flex items-center gap-1 text-success-600 font-semibold flex-shrink-0">
            <DollarSign size={14} />
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Buyer */}
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-default-400" />
          <p className="text-default-600">
            {order.buyer.firstName} {order.buyer.lastName}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-default-400" />
          <p className="text-default-500">
            {formatDateTime(new Date(order.createdAt)).dateOnly}
          </p>
        </div>

        {/* Order ID */}
        <p className="text-xs text-default-400 truncate">Order: {order.id}</p>
      </div>
    </AdminCard>
  );
};

export default OrderCard;
