"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, Circle } from "lucide-react"

interface StageStatusIndicatorProps {
  stageId: string
  className?: string
}

type StageStatus = "pending" | "in-progress" | "completed" | "blocked"

// Mock stage statuses - in a real app this would come from your state management
const getStageStatus = (stageId: string): StageStatus => {
  const statusMap: Record<string, StageStatus> = {
    "offer-accepted": "completed",
    "proof-of-funds": "in-progress",
    "add-conveyancer": "pending",
    "draft-contract": "pending",
    "search-survey": "pending",
    enquiries: "pending",
    "mortgage-offer": "pending",
    "completion-date": "pending",
    "contract-exchange": "pending",
    "nutlip-transaction-fee": "pending",
    "replies-to-requisitions": "pending",
    completion: "pending",
  }

  return statusMap[stageId] || "pending"
}

export function StageStatusIndicator({ stageId, className = "" }: StageStatusIndicatorProps) {
  const status = getStageStatus(stageId)

  const getStatusConfig = (status: StageStatus) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Completed",
        }
      case "in-progress":
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          label: "In Progress",
        }
      case "blocked":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Blocked",
        }
      default:
        return {
          icon: Circle,
          color: "text-gray-400",
          bgColor: "bg-gray-100",
          label: "Pending",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant="secondary" className={`${config.bgColor} ${config.color} border-0 ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
