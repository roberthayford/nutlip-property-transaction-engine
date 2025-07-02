"use client"

import { useRealTime } from "@/contexts/real-time-context"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface StageStatusIndicatorProps {
  stageId: string
  className?: string
}

export function StageStatusIndicator({ stageId, className }: StageStatusIndicatorProps) {
  const { transactionState } = useRealTime()
  const status = transactionState?.stageStatuses?.[stageId] ?? "pending"

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-gray-100 text-gray-800",
    },
    "in-progress": {
      icon: Clock,
      label: "In Progress",
      className: "bg-blue-100 text-blue-800",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      className: "bg-green-100 text-green-800",
    },
    blocked: {
      icon: AlertTriangle,
      label: "Blocked",
      className: "bg-red-100 text-red-800",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge className={`${config.className} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
