"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "../actions";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type Status = typeof STATUSES[number];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: Status }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(async () => {
          await updateOrderStatus(orderId, next);
        });
      }}
      className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
