"use client"

import React from 'react'
import { 
  Home, 
  FileCheck, 
  FileText, 
  Banknote, 
  Building, 
  Key, 
  Calendar, 
  CheckSquare, 
  Search, 
  ClipboardCheck,
  UserCheck,
  FileSignature,
  ShieldCheck
} from 'lucide-react'

// Define the stage icon props interface
export interface NutlipStageIconProps {
  stageId: string
  isActive?: boolean
  isCompleted?: boolean
  isAllowed?: boolean
  isNext?: boolean
  className?: string
  size?: number
}

// Custom wrapper component for stage icons with Nutlip branding
export function NutlipStageIcon({ 
  stageId, 
  isActive = false, 
  isCompleted = false, 
  isAllowed = true,
  isNext = false,
  className = "",
  size = 20
}: NutlipStageIconProps) {
  
  // Map of stage IDs to custom icon components
  const stageIconMap: Record<string, React.FC<{ className?: string, size: number }>> = {
    'offer-accepted': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Banknote size={size} className="text-current" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckSquare size={size * 0.5} className="text-current opacity-70 translate-x-1 translate-y-1" />
        </div>
      </div>
    ),
    'instruct-conveyancer': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <UserCheck size={size} className="text-current" />
        <div className="absolute bottom-0 right-0">
          <FileText size={size * 0.5} className="text-current opacity-70" />
        </div>
      </div>
    ),
    'conveyancing-started': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <FileText size={size} className="text-current" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Calendar size={size * 0.5} className="text-current opacity-70 translate-y-1" />
        </div>
      </div>
    ),
    'searches-ordered': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Search size={size} className="text-current" />
        <div className="absolute bottom-0 right-0">
          <ClipboardCheck size={size * 0.5} className="text-current opacity-70" />
        </div>
      </div>
    ),
    'survey-booked': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Building size={size} className="text-current" />
        <div className="absolute bottom-0 right-0">
          <Calendar size={size * 0.5} className="text-current opacity-70" />
        </div>
      </div>
    ),
    'mortgage-offer': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <FileSignature size={size} className="text-current" />
        <div className="absolute bottom-0 right-0">
          <Banknote size={size * 0.5} className="text-current opacity-70" />
        </div>
      </div>
    ),
    'exchange-contracts': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <FileCheck size={size} className="text-current" />
        <div className="absolute bottom-0 right-0">
          <ShieldCheck size={size * 0.5} className="text-current opacity-70" />
        </div>
      </div>
    ),
    'completion': ({ className, size }) => (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Home size={size} className="text-current" />
        <div className="absolute bottom-0 right-0">
          <Key size={size * 0.5} className="text-current opacity-70" />
        </div>
      </div>
    ),
  }

  // Default icon if no match is found
  const DefaultIcon = ({ className, size }: { className?: string, size: number }) => (
    <FileText size={size} className={className} />
  )

  // Get the icon component for this stage
  const IconComponent = stageIconMap[stageId] || DefaultIcon
  
  // Determine icon color based on state
  const getIconColorClass = () => {
    if (isCompleted) return 'text-green-600'
    if (isActive) return 'text-[#003366]'
    if (isNext && isAllowed) return 'text-[#4299E1]'
    return 'text-gray-400'
  }

  return (
    <div className={`${getIconColorClass()} ${className}`}>
      <IconComponent size={size} />
    </div>
  )
}
