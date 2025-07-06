"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { StageStatusIndicator } from "@/components/stage-status-indicator"
import { TransactionStage } from "@/components/transaction-layout"

interface EnhancedTransactionProgressProps {
  stages: TransactionStage[]
  currentStageIndex: number
  canAccessStage: (stage: TransactionStage) => boolean
  stageUrl: (stage: TransactionStage) => string
}

export function EnhancedTransactionProgress({
  stages,
  currentStageIndex,
  canAccessStage,
  stageUrl,
}: EnhancedTransactionProgressProps) {
  // Calculate overall progress percentage
  const progressPercentage = stages.length > 1 
    ? ((currentStageIndex) / (stages.length - 1)) * 100 
    : 0

  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-4">
        {/* Progress bar container */}
        <div className="relative mb-3">
          {/* Background progress track */}
          <div className="absolute h-1.5 bg-gray-200 left-0 right-0 top-1/2 -translate-y-1/2 rounded-full"></div>
          
          {/* Active progress indicator */}
          <div 
            className="absolute h-1.5 bg-green-500 left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }} 
          ></div>
        </div>

        {/* Transaction stages */}
        <div className="flex items-start justify-between w-full">
          {stages.map((stage, i) => {
            const Icon = stage.icon
            const isActive = i === currentStageIndex
            const isCompleted = i < currentStageIndex
            const isAllowed = canAccessStage(stage)
            const isLast = i === stages.length - 1

            return (
              <div key={stage.id} className="relative flex flex-col items-center flex-1">
                <Link
                  href={stageUrl(stage)}
                  className={`group relative flex flex-col items-center w-full p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : isAllowed
                          ? "hover:bg-accent"
                          : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={(e) => !isAllowed && e.preventDefault()}
                >
                  <div className="flex items-center justify-center w-8 h-8 mb-1.5 rounded-full bg-white/80 group-hover:bg-white/90 transition-colors">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight px-1">{stage.title}</span>
                  <StageStatusIndicator stageId={stage.id} className="absolute -top-1 -right-1" />
                  {isCompleted && (
                    <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full" />
                  )}
                </Link>

                {/* Stage indicator dot */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                  isCompleted ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-gray-200'
                }`} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
