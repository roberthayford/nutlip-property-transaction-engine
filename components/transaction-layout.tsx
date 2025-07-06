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
  ArrowLeft,
  Building,
  ChevronRight,
  Scale,
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
import { MessengerChat } from "@/components/messenger-chat"
import { BuyerEstateAgentChat } from "@/components/buyer-estate-agent-chat"
import { EnhancedTransactionProgress } from "@/components/enhanced-transaction-progress"
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
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"],
  },
  {
    id: "add-conveyancer",
    title: "Add Conveyancer",
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

const getUserName = (userRole: UserRole): string => {
  switch (userRole) {
    case "buyer":
      return "John D"
    case "buyer-conveyancer":
      return "Sarah J"
    case "seller-conveyancer":
      return "Alex M"
    case "estate-agent":
      return "Emma R"
    default:
      return "User"
  }
}

// Roles that can access the professional messenger chat (conveyancers only)
const PROFESSIONAL_CHAT_ENABLED_ROLES: UserRole[] = ["buyer-conveyancer", "seller-conveyancer"]

// Stages where estate agents can access the professional messenger chat (from Draft Contract onwards)
const ESTATE_AGENT_PROFESSIONAL_CHAT_STAGES = [
  "draft-contract",
  "search-survey",
  "enquiries",
  "mortgage-offer",
  "completion-date",
  "contract-exchange",
  "nutlip-transaction-fee",
  "replies-to-requisitions",
  "completion",
]

// Roles that can access the buyer-estate agent chat
const BUYER_ESTATE_AGENT_CHAT_ROLES: UserRole[] = ["buyer", "estate-agent"]

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

  // Fix the stage URL to use add-conveyancer instead of conveyancers
  const stageUrl = (stage: TransactionStage) => {
    const stageId = stage.id === "conveyancers" ? "add-conveyancer" : stage.id
    return `/${role}/${stageId}`
  }

  // Check if current role can access professional messenger chat
  const canUseProfessionalChat =
    PROFESSIONAL_CHAT_ENABLED_ROLES.includes(role) ||
    (role === "estate-agent" && ESTATE_AGENT_PROFESSIONAL_CHAT_STAGES.includes(currentStageId))

  // Check if current role can access buyer-estate agent chat
  const canUseBuyerEstateAgentChat = BUYER_ESTATE_AGENT_CHAT_ROLES.includes(role)

  /* ------------------------------------------------------- */
  /*                    Reset functionality                  */
  /* ------------------------------------------------------- */
  const { sendUpdate } = useRealTime()

  const clearBrowserCache = async () => {
    try {
      // Clear service worker caches if available
      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }
    } catch (error) {
      console.error("Error clearing caches:", error)
    }
  }

  const clearBrowserHistory = () => {
    try {
      // Clear browser history by replacing current state
      if (window.history && window.history.replaceState) {
        // Replace current history entry
        window.history.replaceState(null, "", window.location.pathname)

        // Clear any stored history state
        if (window.history.state) {
          window.history.replaceState(null, "", window.location.pathname)
        }
      }
    } catch (error) {
      console.error("Error clearing history:", error)
    }
  }

  const handleReset = async () => {
    // Show loading state
    toast({
      title: "Resetting Demo...",
      description: "Clearing all data, cache, and history. This may take a moment.",
    })

    try {
      // Clear all localStorage items related to property transaction engine
      const allKeys = Object.keys(localStorage)
      allKeys.forEach((key) => {
        if (
          key.includes("nutlip") ||
          key.includes("pte") ||
          key.includes("transaction") ||
          key.includes("buyer") ||
          key.includes("seller") ||
          key.includes("conveyancer") ||
          key.includes("estate-agent") ||
          key.includes("chat") ||
          key.includes("proof-of-funds")
        ) {
          localStorage.removeItem(key)
        }
      })

      // Clear sessionStorage related to property transaction engine
      const sessionKeys = Object.keys(sessionStorage)
      sessionKeys.forEach((key) => {
        if (
          key.includes("nutlip") ||
          key.includes("pte") ||
          key.includes("transaction") ||
          key.includes("buyer") ||
          key.includes("seller") ||
          key.includes("conveyancer") ||
          key.includes("estate-agent") ||
          key.includes("chat") ||
          key.includes("proof-of-funds")
        ) {
          sessionStorage.removeItem(key)
        }
      })

      // Clear browser cache
      await clearBrowserCache()

      // Clear browser history
      clearBrowserHistory()

      // Clear any IndexedDB databases related to the property transaction engine
      if ("indexedDB" in window) {
        try {
          // List of potential database names to clear
          const dbNames = ["nutlip-db", "property-transaction-db", "pte-db"]
          for (const dbName of dbNames) {
            indexedDB.deleteDatabase(dbName)
          }
        } catch (error) {
          console.error("Error clearing IndexedDB:", error)
        }
      }

      // Clear any cookies related to the property transaction engine
      if (document.cookie) {
        const cookies = document.cookie.split(";")
        cookies.forEach((cookie) => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name.includes("nutlip") || name.includes("pte") || name.includes("transaction")) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          }
        })
      }
    } catch (error) {
      console.error("Error during cleanup:", error)
    }

    // Show success toast
    setTimeout(() => {
      toast({
        title: "Demo Reset Complete",
        description:
          "All Property Transaction Engine data, cache, history, and storage have been cleared. The platform has been reset to default state.",
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
      <header className="border-b sticky top-0 z-50 bg-gradient-to-r from-[#002952] to-[#003366] shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="group flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
                <div className="relative overflow-hidden rounded-lg p-0.5 bg-gradient-to-r from-[#4299E1] to-[#003366]">
                  <img src="/nutlip_logo.webp" alt="Nutlip" className="h-10 md:h-10 relative z-10 bg-white p-1 rounded-md" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-blue-200">Property Transaction Engine</span>
                </div>
              </Link>
              <Badge
                className={`ml-2 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border-2 border-white/20
                  ${role === "buyer" ? "bg-[#4299E1]/90 text-white" : ""}
                  ${role === "estate-agent" ? "bg-[#10B981]/90 text-white" : ""}
                  ${role === "buyer-conveyancer" ? "bg-[#8B5CF6]/90 text-white" : ""}
                  ${role === "seller-conveyancer" ? "bg-[#F59E0B]/90 text-white" : ""}
                `}
              >
                {userRoleLabels[role]}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <RealTimeIndicator />

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-6">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent !text-white hover:bg-slate-700 hover:border-slate-600">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Demo
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Property Transaction Engine</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will completely reset the Property Transaction Engine to its default state. All
                            transaction progress, documents, proposals, updates, stage completions, browser cache, and
                            history will be cleared. The demo will return to the initial state with all stages set to
                            pending. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                            Reset Everything
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link href={dashboardUrls[role]} className="group">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="relative overflow-hidden bg-white/10 hover:bg-white/20 !text-white border border-white/20"
                      >
                        {/* Background animation on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        
                        {/* Role-specific icon */}
                        <div className={`mr-2 p-1 rounded-full
                          ${role === "buyer" ? "bg-[#4299E1]/20" : ""}
                          ${role === "estate-agent" ? "bg-[#10B981]/20" : ""}
                          ${role === "buyer-conveyancer" ? "bg-[#8B5CF6]/20" : ""}
                          ${role === "seller-conveyancer" ? "bg-[#F59E0B]/20" : ""}
                        `}>
                          {role === "buyer" && <User className="h-4 w-4" />}
                          {role === "estate-agent" && <Building className="h-4 w-4" />}
                          {role === "buyer-conveyancer" && <Scale className="h-4 w-4" />}
                          {role === "seller-conveyancer" && <Users className="h-4 w-4" />}
                        </div>
                        Back to {userRoleLabels[role]} Dashboard
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
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent !text-white hover:bg-slate-700 hover:border-slate-600">
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset Demo</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Property Transaction Engine</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will completely reset the Property Transaction Engine to its default state. All transaction
                        progress, documents, proposals, updates, stage completions, browser cache, and history will be
                        cleared. The demo will return to the initial state with all stages set to pending. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                        Reset Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Link href={dashboardUrls[role]} className="group">
                  <Button 
                    variant="ghost" 
                    className="relative overflow-hidden bg-white/10 hover:bg-white/20 !text-white border border-white/20"
                  >
                    {/* Background animation on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    
                    {/* Role-specific icon */}
                    <div className={`mr-2 p-1 rounded-full
                      ${role === "buyer" ? "bg-[#4299E1]/20" : ""}
                      ${role === "estate-agent" ? "bg-[#10B981]/20" : ""}
                      ${role === "buyer-conveyancer" ? "bg-[#8B5CF6]/20" : ""}
                      ${role === "seller-conveyancer" ? "bg-[#F59E0B]/20" : ""}
                    `}>
                      {role === "buyer" && <User className="h-4 w-4" />}
                      {role === "estate-agent" && <Building className="h-4 w-4" />}
                      {role === "buyer-conveyancer" && <Scale className="h-4 w-4" />}
                      {role === "seller-conveyancer" && <Users className="h-4 w-4" />}
                    </div>
                    Back to {userRoleLabels[role]} Dashboard
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent !text-white hover:bg-slate-700 hover:border-slate-600 hover:!text-white">
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

      {/* Enhanced Progress bar */}
      <EnhancedTransactionProgress 
        stages={transactionStages}
        currentStageIndex={currentStageIndex}
        canAccessStage={canAccessStage}
        stageUrl={stageUrl}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 md:py-8">{children}</main>

      {/* Professional Messenger Chat - For conveyancers and estate agents (from Draft Contract onwards) */}
      {canUseProfessionalChat && <MessengerChat currentUserRole={role} currentUserName={getUserName(role)} />}

      {/* Buyer-Estate Agent Chat - Only for buyer and estate agent in specific stages */}
      {canUseBuyerEstateAgentChat && (
        <BuyerEstateAgentChat
          currentUserRole={role as "buyer" | "estate-agent"}
          currentUserName={getUserName(role)}
          currentStage={currentStageId}
        />
      )}
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
