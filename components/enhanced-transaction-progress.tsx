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
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Progress bar container with relative positioning */}
        <div className="relative mb-2">
          {/* Background progress track */}
          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-1/2 -translate-y-1/2 rounded-full"></div>
          
          {/* Active progress indicator */}
          <div 
            className="absolute h-1 bg-green-500 left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }} 
          ></div>
        </div>

        {/* Transaction stages */}
        <div className="flex items-center justify-start space-x-1 md:space-x-2 overflow-x-auto pb-2 relative">
          {stages.map((stage, i) => {
            const Icon = stage.icon
            const isActive = i === currentStageIndex
            const isCompleted = i < currentStageIndex
            const isAllowed = canAccessStage(stage)

            return (
              <div key={stage.id} className="flex items-center space-x-1 md:space-x-2 min-w-0">
                <Link
                  href={stageUrl(stage)}
                  className={`flex flex-col items-center space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg transition-colors min-w-[80px] md:min-w-[120px] relative ${
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
                  <Icon className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="text-xs font-medium text-center leading-tight">{stage.title}</span>
                  <StageStatusIndicator stageId={stage.id} className="absolute -top-1 -right-1" />
                  {isCompleted && <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />}
                </Link>

                {/* Connecting line between stages */}
                {i < stages.length - 1 && (
                  <div 
                    className={`h-0.5 w-4 md:w-8 transition-colors duration-300 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`} 
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
