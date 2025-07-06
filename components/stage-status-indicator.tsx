"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

const statusConfig: Record<StageStatus, { icon: any; color: string; bgColor: string; label: string; variant: "default" | "secondary" | "destructive" | "outline"; textColor: string; borderColor: string; shadowColor: string; text: string }> = {
  "pending": {
    icon: AlertCircle,
    color: "text-gray-500",
    bgColor: "bg-white",
    label: "Pending",
    variant: "outline",
    textColor: "text-gray-500",
    borderColor: "border-gray-200",
    shadowColor: "shadow-gray-100",
    text: "Pending",
  },
  "in-progress": {
    icon: Clock,
    color: "text-blue-700",
    bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
    label: "In Progress",
    variant: "secondary",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    shadowColor: "shadow-blue-100",
    text: "In Progress",
  },
  "completed": {
    icon: CheckCircle2,
    color: "text-white",
    bgColor: "bg-gradient-to-r from-green-500 to-green-600",
    label: "Completed",
    variant: "default",
    textColor: "text-white",
    borderColor: "border-green-600",
    shadowColor: "shadow-green-200",
    text: "Completed",
  },
  "blocked": {
    icon: AlertCircle,
    color: "text-white",
    bgColor: "bg-gradient-to-r from-red-500 to-red-600",
    label: "Blocked",
    variant: "destructive",
    textColor: "text-white",
    borderColor: "border-red-600",
    shadowColor: "shadow-red-200",
    text: "Blocked",
  },
}

export function StageStatusIndicator({ stageId, className }: StageStatusIndicatorProps) {
  const status = getStageStatus(stageId)

  // Animation state for completed stages
  const [showAnimation, setShowAnimation] = useState(false)
  const [prevStatus, setPrevStatus] = useState(status)

  // Trigger animation when status changes to completed
  useEffect(() => {
    if (status === "completed" && prevStatus !== "completed") {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
    setPrevStatus(status)
  }, [status, prevStatus])

  const config = statusConfig[status]
  const Icon = config.icon

  if (!config) return null

  return (
    <div className="relative">
      {/* Main badge with enhanced styling */}
      <Badge
        variant={config.variant}
        className={cn(
          "h-6 px-2 flex items-center gap-1 text-[0.65rem] font-medium transition-all duration-300",
          config.bgColor,
          config.textColor,
          config.borderColor ? `border ${config.borderColor}` : "",
          `shadow-sm ${config.shadowColor}`,
          status === "completed" ? "ring-2 ring-green-200 ring-opacity-50" : "",
          className
        )}
      >
        <Icon className={cn("h-3.5 w-3.5", status === "completed" && showAnimation ? "animate-bounce" : "")} />
        <span className="sr-only">{config.text}</span>
      </Badge>

      {/* Confetti animation for completed status */}
      {status === "completed" && showAnimation && (
        <div className="absolute -inset-4 pointer-events-none z-10">
          <div className="confetti-animation">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full opacity-0 animate-confetti-fall`}
                style={{
                  backgroundColor: i % 3 === 0 ? '#003366' : i % 3 === 1 ? '#4299E1' : '#10B981',
                  left: `${50 + (Math.random() * 30 - 15)}%`,
                  top: `${50 + (Math.random() * 30 - 15)}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.5 + Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
