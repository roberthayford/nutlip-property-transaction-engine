"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Menu,
  Home,
  User,
  Building,
  Scale,
  Users,
  RotateCcw,
  AlertTriangle,
} from "lucide-react"
import { StageStatusIndicator } from "./stage-status-indicator"
import { RealTimeIndicator } from "./real-time-indicator"
import { RealTimeActivityFeed } from "./real-time-activity-feed"
import { useRealTime } from "@/contexts/real-time-context"
import type { Role } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"

interface TransactionStage {
  id: string
  title: string
  description: string
  allowedRoles: Role[]
  dependencies?: string[]
}

const transactionStages: TransactionStage[] = [
  {
    id: "offer-accepted",
    title: "Offer Accepted",
    description: "Property offer has been accepted by the seller",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "proof-of-funds",
    title: "Proof of Funds",
    description: "Buyer provides evidence of available funds",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["offer-accepted"],
  },
  {
    id: "conveyancers",
    title: "Conveyancers",
    description: "Legal representatives appointed for the transaction",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["proof-of-funds"],
  },
  {
    id: "draft-contract",
    title: "Draft Contract",
    description: "Legal contract prepared and reviewed",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["conveyancers"],
  },
  {
    id: "search-survey",
    title: "Search & Survey",
    description: "Property searches and surveys conducted",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["draft-contract"],
  },
  {
    id: "enquiries",
    title: "Enquiries",
    description: "Legal and property enquiries raised and answered",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["search-survey"],
  },
  {
    id: "mortgage-offer",
    title: "Mortgage Offer",
    description: "Formal mortgage offer received and accepted",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["enquiries"],
  },
  {
    id: "completion-date",
    title: "Completion Date",
    description: "Completion date agreed between all parties",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["mortgage-offer"],
  },
  {
    id: "contract-exchange",
    title: "Contract Exchange",
    description: "Legal contracts exchanged between parties",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["completion-date"],
  },
  {
    id: "nutlip-transaction-fee",
    title: "Nutlip Transaction Fee",
    description: "Platform transaction fee processed",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["contract-exchange"],
  },
  {
    id: "replies-to-requisitions",
    title: "Replies to Requisitions",
    description: "Final legal requisitions addressed",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["nutlip-transaction-fee"],
  },
  {
    id: "completion",
    title: "Completion",
    description: "Transaction completed and keys transferred",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
    dependencies: ["replies-to-requisitions"],
  },
]

const roleConfig = {
  buyer: {
    title: "Buyer Dashboard",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  "estate-agent": {
    title: "Estate Agent Dashboard",
    icon: Building,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  "buyer-conveyancer": {
    title: "Buyer Conveyancer Dashboard",
    icon: Scale,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  "seller-conveyancer": {
    title: "Seller Conveyancer Dashboard",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
}

interface TransactionLayoutProps {
  role?: Role
  currentStage?: string
  children: React.ReactNode
}

export function TransactionLayout({ role: roleProp, currentStage, children }: TransactionLayoutProps) {
  const pathname = usePathname()

  // infer role from /{role}/{stage} or default to "buyer"
  const inferredRole = pathname.split("/")[1] as Role | undefined
  const role: Role = roleProp ?? inferredRole ?? "buyer"

  const { transactionState, resetToDefault } = useRealTime()
  const { toast } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  const config = roleConfig[role]
  const Icon = config.icon

  // Get current stage from pathname
  const currentStageId = currentStage ?? pathname.split("/").pop() ?? ""

  // Filter stages based on role permissions
  const allowedStages = transactionStages.filter((stage) => stage.allowedRoles.includes(role))

  const getStageStatus = (stageId: string) => {
    return transactionState?.stageStatuses?.[stageId] || "pending"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const handleResetDemo = async () => {
    setIsResetting(true)

    try {
      // Show confirmation toast
      toast({
        title: "Resetting Platform",
        description: "Clearing all data and returning to default state...",
        duration: 2000,
      })

      // Call the reset function from context
      resetToDefault()

      // Show success toast
      setTimeout(() => {
        toast({
          title: "Platform Reset Complete",
          description: "All data has been cleared and platform returned to default state.",
          duration: 3000,
        })
        setIsResetting(false)
      }, 1000)

      // Reload the page after a short delay to ensure clean state
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      console.error("Error resetting platform:", error)
      toast({
        title: "Reset Failed",
        description: "There was an error resetting the platform. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
      setIsResetting(false)
    }
  }

  const StageNavigation = () => (
    <div className="space-y-2">
      {allowedStages.map((stage) => {
        const status = getStageStatus(stage.id)
        const isActive = currentStageId === stage.id
        const isAccessible = status !== "blocked"

        return (
          <Link
            key={stage.id}
            href={`/${role}/${stage.id}`}
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? `${config.bgColor} ${config.borderColor} border-2 ${config.color}`
                  : isAccessible
                    ? "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    : "text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <div className="flex-shrink-0">{getStatusIcon(status)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{stage.title}</div>
              <div className="text-xs text-gray-500 truncate">{stage.description}</div>
            </div>
            <Badge variant="outline" className={`text-xs ${getStatusColor(status)}`}>
              {status}
            </Badge>
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="py-4">
                    <div className="mb-6">
                      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                        <Home className="h-5 w-5" />
                        Nutlip
                      </Link>
                    </div>
                    <StageNavigation />
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center gap-2">
                <Home className="h-6 w-6 text-gray-600" />
                <span className="font-semibold text-gray-900 hidden sm:block">Nutlip</span>
              </Link>

              <div className="hidden sm:flex items-center gap-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                <span className="font-medium text-gray-900">{config.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RealTimeIndicator />

              {/* Reset Demo Button */}
              <Button
                onClick={handleResetDemo}
                disabled={isResetting}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Reset Demo
                  </>
                )}
              </Button>

              <Link href="/">
                <Button variant="outline" size="sm">
                  Switch Role
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Transaction Stages</h2>
              <p className="text-sm text-gray-600">Track your progress through each stage</p>
            </div>

            <StageNavigation />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            <div className="mb-6">
              <StageStatusIndicator currentStage={currentStageId} role={role} />
            </div>

            {children}
          </div>
        </main>

        {/* Activity Feed - Desktop */}
        <aside className="hidden xl:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <div className="p-6">
            <RealTimeActivityFeed />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TransactionLayout
