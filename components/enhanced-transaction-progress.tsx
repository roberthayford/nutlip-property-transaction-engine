"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { StageStatusIndicator } from "@/components/stage-status-indicator"
import { NutlipStageIcon } from "@/components/nutlip-stage-icons"
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
  // Track previous stage index for animation
  const [prevStageIndex, setPrevStageIndex] = useState(currentStageIndex)
  const [showProgressAnimation, setShowProgressAnimation] = useState(false)
  
  // Calculate overall progress percentage
  const progressPercentage = stages.length > 1 
    ? ((currentStageIndex) / (stages.length - 1)) * 100 
    : 0
    
  // Trigger animation when stage changes
  useEffect(() => {
    if (currentStageIndex > prevStageIndex) {
      setShowProgressAnimation(true)
      const timer = setTimeout(() => {
        setShowProgressAnimation(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
    setPrevStageIndex(currentStageIndex)
  }, [currentStageIndex, prevStageIndex])

  return (
    <div className="border-b bg-gradient-to-r from-[#f8fafc] via-white to-[#f8fafc]">
      <div className="container mx-auto px-4 py-6">
        {/* Progress bar container */}
        <div className="relative mb-5">
          {/* Background progress track */}
          <div className="absolute h-2.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 left-0 right-0 top-1/2 -translate-y-1/2 rounded-full shadow-inner"></div>
          
          {/* Active progress indicator */}
          <div 
            className="absolute h-2.5 bg-gradient-to-r from-[#003366] to-[#4299E1] left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out shadow-md"
            style={{ width: `${progressPercentage}%` }} 
          >
            {/* Animated pulse effect at the end of the progress bar */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-[#003366] shadow-md ${showProgressAnimation ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>

        {/* Transaction stages */}
        <div className="flex items-start justify-between w-full">
          {stages.map((stage, i) => {
            const Icon = stage.icon
            const isActive = i === currentStageIndex
            const isCompleted = i < currentStageIndex
            const isAllowed = canAccessStage(stage)
            const isLast = i === stages.length - 1
            const isNext = i === currentStageIndex + 1

            // Get role-specific colors
            const getRoleColor = (role: string) => {
              switch(role) {
                case 'buyer': return '#4299E1';
                case 'estate-agent': return '#10B981';
                case 'buyer-conveyancer': return '#8B5CF6';
                case 'seller-conveyancer': return '#F59E0B';
                default: return '#003366';
              }
            };

            return (
              <div key={stage.id} className="relative flex flex-col items-center flex-1">
                <Link
                  href={stageUrl(stage)}
                  className={`group relative flex flex-col items-center w-full p-2 rounded-lg transition-all duration-300 ${isActive ? 'transform scale-110' : ''} ${
                    isActive
                      ? "bg-gradient-to-br from-[#003366] to-[#0053a6] text-white shadow-md"
                      : isCompleted
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm hover:shadow-md"
                        : isAllowed
                          ? "bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#4299E1]/50"
                          : "bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                  onClick={(e) => !isAllowed && e.preventDefault()}
                >
                  <div className={`flex items-center justify-center w-10 h-10 mb-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-[#003366] shadow-inner'
                      : isCompleted
                        ? 'bg-white text-green-600'
                        : isNext && isAllowed
                          ? 'bg-white/90 text-[#4299E1] border border-[#4299E1]/30 group-hover:border-[#4299E1]'
                          : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                    <NutlipStageIcon 
                      stageId={stage.id} 
                      isActive={isActive} 
                      isCompleted={isCompleted} 
                      isAllowed={isAllowed} 
                      isNext={isNext} 
                      size={20} 
                    />
                  </div>
                  <span className={`text-xs font-medium text-center leading-tight px-1 ${isActive || isCompleted ? 'text-white' : 'text-gray-700'}`}>
                    {stage.title}
                  </span>
                  
                  {/* Status indicators */}
                  {!isCompleted && (
                    <StageStatusIndicator 
                      stageId={stage.id} 
                      className={`absolute -top-1 -right-1 ${isActive ? 'scale-110' : ''}`} 
                    />
                  )}
                  
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-white rounded-full shadow-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </Link>

                {/* Enhanced stage indicator dot */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                  isCompleted 
                    ? 'w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm' 
                    : isActive 
                      ? 'w-3 h-3 bg-gradient-to-r from-[#003366] to-[#0053a6] rounded-full shadow-sm' 
                      : 'w-2 h-2 bg-gray-200 rounded-full'
                }`} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
