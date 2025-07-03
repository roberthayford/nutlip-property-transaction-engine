"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  HandHeart,
  CreditCard,
  Users,
  FileText,
  Search,
  MessageSquare,
  Home,
  Calendar,
  Handshake,
  DollarSign,
  Reply,
  CheckCircle,
  User,
  ChevronDown,
  RotateCcw,
  Menu,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { RealTimeProvider, useRealTime } from "@/contexts/real-time-context"
import { RealTimeIndicator } from "@/components/real-time-indicator"
import { StageStatusIndicator } from "@/components/stage-status-indicator"
import { toast } from "@/hooks/use-toast"

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

export type UserRole = "buyer" | "estate-agent" | "buyer-conveyancer" | "seller-conveyancer"

export interface TransactionStage {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  allowedRoles: UserRole[]
}

/* -------------------------------------------------------------------------- */
/*                                Stage list                                  */
/* -------------------------------------------------------------------------- */

export const transactionStages: TransactionStage[] = [
  {
    id: "offer-accepted",
    title: "Offer Accepted",
    icon: HandHeart,
    description: "Initial offer acceptance and agreement",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "proof-of-funds",
    title: "Proof of Funds",
    icon: CreditCard,
    description: "Verification of buyer financial capability",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer"],
  },
  {
    id: "conveyancers",
    title: "Conveyancers",
    icon: Users,
    description: "Legal representatives appointment",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "draft-contract",
    title: "Draft Contract",
    icon: FileText,
    description: "Initial contract preparation",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "search-survey",
    title: "Search & Survey",
    icon: Search,
    description: "Property searches and surveys",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "enquiries",
    title: "Enquiries",
    icon: MessageSquare,
    description: "Legal and property enquiries",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "mortgage-offer",
    title: "Mortgage Offer",
    icon: Home,
    description: "Mortgage approval and offer",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "completion-date",
    title: "Completion Date",
    icon: Calendar,
    description: "Setting the completion date",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "contract-exchange",
    title: "Contract Exchange",
    icon: Handshake,
    description: "Legal contract exchange",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "nutlip-transaction-fee",
    title: "Nutlip Transaction Fee",
    icon: DollarSign,
    description: "Platform transaction fee payment",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "replies-to-requisitions",
    title: "Replies to Requisitions",
    icon: Reply,
    description: "Responding to legal requisitions",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "completion",
    title: "Completion",
    icon: CheckCircle,
    description: "Final transaction completion",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
]

/* -------------------------------------------------------------------------- */
/*                              Helper look-ups                               */
/* -------------------------------------------------------------------------- */

const userRoleLabels: Record<UserRole, string> = {
  buyer: "Buyer",
  "estate-agent": "Estate Agent",
  "buyer-conveyancer": "Buyer Conveyancer",
  "seller-conveyancer": "Seller Conveyancer",
}

const dashboardUrls: Record<UserRole, string> = {
  buyer: "/buyer",
  "estate-agent": "/estate-agent",
  "buyer-conveyancer": "/buyer-conveyancer",
  "seller-conveyancer": "/seller-conveyancer",
}

/* -------------------------------------------------------------------------- */
/*                              Layout component                              */
/* -------------------------------------------------------------------------- */

interface TransactionLayoutProps {
  children: React.ReactNode
  currentStage?: string
  /** Explicit role (optional). If omitted, inferred from URL. */
  userRole?: UserRole
}

function TransactionLayoutInner({ children, currentStage, userRole }: TransactionLayoutProps) {
  /* ------------------------------------------------------- */
  /*                    Role & Stage logic                   */
  /* ------------------------------------------------------- */
  const pathname = usePathname()
  const pathSegments = pathname.split("/")

  // /{role}/{stage}
  const roleFromPath = pathSegments.length > 2 ? (pathSegments[1] as UserRole) : undefined
  const role: UserRole = userRole ?? roleFromPath ?? "buyer"

  const [selectedRole] = useState<UserRole>(role)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stageFromPath = pathSegments[pathSegments.length - 1]
  const currentStageId = currentStage || stageFromPath
  const currentStageIndex = transactionStages.findIndex((stage) => stage.id === currentStageId)

  const canAccessStage = (stage: TransactionStage) => stage.allowedRoles.includes(role)
  const stageUrl = (stage: TransactionStage) => `/${role}/${stage.id}`

  /* ------------------------------------------------------- */
  /*                    Reset functionality                  */
  /* ------------------------------------------------------- */
  const { resetToDefault } = useRealTime()

  const handleReset = () => {
    // Show loading state
    toast({
      title: "Resetting Demo...",
      description: "Clearing all data and resetting to default state.",
    })

    // Use the context's reset function
    resetToDefault()

    // Additional cleanup for any remaining data
    try {
      // Clear any remaining localStorage items
      const allKeys = Object.keys(localStorage)
      allKeys.forEach((key) => {
        if (
          key.includes("nutlip") ||
          key.includes("pte") ||
          key.includes("transaction") ||
          key.includes("buyer") ||
          key.includes("seller") ||
          key.includes("conveyancer") ||
          key.includes("estate-agent")
        ) {
          localStorage.removeItem(key)
        }
      })

      // Clear sessionStorage
      const sessionKeys = Object.keys(sessionStorage)
      sessionKeys.forEach((key) => {
        if (
          key.includes("nutlip") ||
          key.includes("pte") ||
          key.includes("transaction") ||
          key.includes("buyer") ||
          key.includes("seller") ||
          key.includes("conveyancer") ||
          key.includes("estate-agent")
        ) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error("Error during additional cleanup:", error)
    }

    // Show success toast
    setTimeout(() => {
      toast({
        title: "Demo Reset Complete",
        description:
          "All transaction data, cache, and storage have been cleared. The platform has been reset to default state.",
      })
    }, 500)

    // Force reload the page to ensure completely clean state
    setTimeout(() => {
      // Clear any remaining browser state
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname)
      }

      // Hard reload to clear any cached JavaScript state
      window.location.reload()
    }, 2000)
  }

  /* ------------------------------------------------------- */
  /*                            UI                           */
  /* ------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="text-xl md:text-2xl font-bold text-primary">
                Nutlip
              </Link>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Property Transaction Engine
              </Badge>
              <Badge
                className={`text-xs md:text-sm
                ${role === "buyer" ? "bg-blue-100 text-blue-800" : ""}
                ${role === "estate-agent" ? "bg-green-100 text-green-800" : ""}
                ${role === "buyer-conveyancer" ? "bg-purple-100 text-purple-800" : ""}
                ${role === "seller-conveyancer" ? "bg-orange-100 text-orange-800" : ""}
              `}
              >
                {userRoleLabels[role]}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <RealTimeIndicator />

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-6">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Demo
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Demo to Default</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset the entire platform to its default state. All transaction progress,
                            documents, proposals, updates, and stage completions will be cleared. The demo will return
                            to the initial "Proof of Funds" stage with all other stages set to pending. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                            Reset to Default
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Link href={dashboardUrls[role]} className="w-full">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Home className="h-4 w-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </Link>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Switch Role</p>
                      {Object.entries(userRoleLabels).map(([r, label]) => (
                        <Link key={r} href={`/${r}/${currentStageId}`} className="block">
                          <Button variant="ghost" className="w-full justify-start mb-1">
                            <User className="h-4 w-4 mr-2" />
                            {label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Reset Demo Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset Demo</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Demo to Default</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset the entire platform to its default state. All transaction progress, documents,
                        proposals, updates, and stage completions will be cleared. The demo will return to the initial
                        "Proof of Funds" stage with all other stages set to pending. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                        Reset to Default
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Link href={dashboardUrls[role]}>
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                      <User className="h-4 w-4" />
                      <span>Switch Role</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {Object.entries(userRoleLabels).map(([r, label]) => (
                      <DropdownMenuItem key={r} asChild>
                        <Link href={`/${r}/${currentStageId}`}>{label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-start space-x-1 md:space-x-2 overflow-x-auto pb-2">
            {transactionStages.map((stage, i) => {
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

                  {i < transactionStages.length - 1 && (
                    <div className={`h-px w-4 md:w-8 ${isCompleted ? "bg-green-400" : "bg-border"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 md:py-8">{children}</main>
    </div>
  )
}

function TransactionLayout(props: TransactionLayoutProps) {
  return (
    <RealTimeProvider>
      <TransactionLayoutInner {...props} />
    </RealTimeProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Exports                                        */
/* -------------------------------------------------------------------------- */

export default TransactionLayout
export { TransactionLayout } // named export for convenience
