"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { StageStatusIndicator } from "@/components/stage-status-indicator"
import { NutlipStageIcon } from "@/components/nutlip-stage-icons"
import { TransactionStage } from "@/components/transaction-layout"
import { trackStageTransition, trackFeatureUsage } from "@/utils/analytics"

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
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
  
  // Calculate overall progress percentage
  const progressPercentage = stages.length > 1 
    ? ((currentStageIndex) / (stages.length - 1)) * 100 
    : 0
    
  // Trigger animation when stage changes
  useEffect(() => {
    if (currentStageIndex > prevStageIndex) {
      setShowProgressAnimation(true)
      // Track stage transition in Google Analytics
      trackStageTransition(
        stages[prevStageIndex]?.name || "unknown", 
        stages[currentStageIndex]?.name || "unknown"
      )
      const timer = setTimeout(() => {
        setShowProgressAnimation(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
    setPrevStageIndex(currentStageIndex)
  }, [currentStageIndex, prevStageIndex, stages])

  // Get stage subtitle based on stage ID
  const getStageSubtitle = (stageId: string): string => {
    switch (stageId) {
      case "offer-accepted": return "Seller agreement";
      case "proof-of-funds": return "Financial verification";
      case "add-conveyancer": return "Legal representation";
      case "draft-contract": return "Legal documents";
      case "search-survey": return "Property checks";
      case "enquiries": return "Legal questions";
      case "mortgage-offer": return "Loan approval";
      case "completion-date": return "Final scheduling";
      case "contract-exchange": return "Legal commitment";
      case "nutlip-transaction-fee": return "Service payment";
      case "replies-to-requisitions": return "Final checks";
      case "completion": return "Keys & ownership";
      default: return "";
    }
  };

  // Check if we're on track (could be more sophisticated based on business logic)
  const isOnTrack = true;

  return (
    <div className="border-b bg-gradient-to-r from-[#f8fafc] via-white to-[#f8fafc]">
      <div className="container mx-auto px-4 py-6">
        {/* Progress details and view toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">
            Step {currentStageIndex + 1} of {stages.length}
            <span className={`ml-2 py-1 px-2 rounded-full text-xs ${isOnTrack ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {isOnTrack ? 'On Track' : 'Behind Schedule'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => {
                setViewMode('grid');
                trackFeatureUsage('progress_view', 'grid');
              }}
              className={`px-2 py-1 rounded ${viewMode === 'grid' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
            >
              Grid View
            </button>
            <button 
              onClick={() => {
                setViewMode('timeline');
                trackFeatureUsage('progress_view', 'timeline');
              }}
              className={`px-2 py-1 rounded ${viewMode === 'timeline' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
            >
              Timeline View
            </button>
          </div>
        </div>
        
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

        {viewMode === 'grid' ? (
          /* Grid View - Transaction stages */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stages.map((stage, i) => {
              const isActive = i === currentStageIndex;
              const isCompleted = i < currentStageIndex;
              const isAllowed = canAccessStage(stage);
              const isNext = i === currentStageIndex + 1;
              
              return (
                <Link
                  key={stage.id}
                  href={stageUrl(stage)}
                  onClick={(e) => !isAllowed && e.preventDefault()}
                  className={`group flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-[#E6F7FF] border border-[#4299E1] shadow-sm"
                      : isCompleted
                        ? "bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#4299E1]/50"
                        : isAllowed
                          ? "bg-white border border-gray-200 hover:shadow-sm hover:border-[#4299E1]/30"
                          : "bg-gray-50 border border-gray-200 opacity-70 cursor-not-allowed"
                  }`}
                >
                  {/* Step number/completion indicator */}
                  <div className={`flex items-center justify-center w-8 h-8 mb-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#4299E1] text-white shadow-sm'
                      : isCompleted
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{i + 1}</span>
                    )}
                  </div>
                  
                  {/* Stage title */}
                  <span className={`text-sm font-medium text-center mb-1 ${
                    isActive ? 'text-[#0053a6]' : 'text-gray-800'
                  }`}>
                    {stage.title}
                  </span>
                  
                  {/* Stage subtitle */}
                  <span className="text-xs text-gray-500 text-center">
                    {getStageSubtitle(stage.id)}
                  </span>
                  
                  {/* Status indicator (if needed) */}
                  {!isCompleted && !isActive && (
                    <StageStatusIndicator 
                      stageId={stage.id} 
                      className="absolute top-1 right-1" 
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          /* Timeline View - Transaction stages */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stages.map((stage, i) => {
              const isActive = i === currentStageIndex;
              const isCompleted = i < currentStageIndex;
              const isAllowed = canAccessStage(stage);
              
              return (
                <div key={stage.id} className={`flex items-start p-3 rounded-lg border ${
                  isActive
                    ? "border-[#4299E1] bg-[#E6F7FF] shadow-sm"
                    : isCompleted
                      ? "border-green-100 bg-white"
                      : "border-gray-200 bg-white"
                }`}>
                  {/* Step number/completion indicator */}
                  <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-full flex-shrink-0 ${
                    isActive
                      ? 'bg-[#4299E1] text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{i + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Link
                      href={stageUrl(stage)}
                      onClick={(e) => !isAllowed && e.preventDefault()}
                      className={`block ${!isAllowed ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      {/* Stage title */}
                      <h3 className={`text-sm font-semibold mb-0.5 ${
                        isActive ? 'text-[#0053a6]' : 'text-gray-800'
                      }`}>
                        {stage.title}
                      </h3>
                      
                      {/* Stage subtitle */}
                      <p className="text-xs text-gray-500">
                        {getStageSubtitle(stage.id)}
                      </p>
                    </Link>
                  </div>
                  
                  {/* Status indicator (if needed) */}
                  {!isCompleted && !isActive && (
                    <StageStatusIndicator 
                      stageId={stage.id} 
                      className="ml-auto" 
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
