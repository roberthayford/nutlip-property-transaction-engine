"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, AlertTriangle, Edit, Send, History, X, Plus } from "lucide-react"
import Link from "next/link"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"

interface CompletionProposal {
  id: string
  date: string
  time: string
  proposedBy: string
  reason: string
  status: "pending" | "accepted" | "rejected"
  timestamp: string
  responses?: Array<{
    party: string
    status: "accepted" | "rejected"
    timestamp: string
    notes?: string
  }>
}

// Helper functions for localStorage
const getStoredProposals = (): CompletionProposal[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("completion_proposals")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading stored proposals:", error)
    return []
  }
}

const storeProposals = (proposals: CompletionProposal[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("completion_proposals", JSON.stringify(proposals))
  } catch (error) {
    console.error("Error storing proposals:", error)
  }
}

export default function BuyerConveyancerCompletionDatePage() {
  const [proposedDate, setProposedDate] = useState("2024-05-28")
  const [notes, setNotes] = useState("")
  const [dateConfirmed, setDateConfirmed] = useState(false)
  const [isProposing, setIsProposing] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("14:00")
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showProposals, setShowProposals] = useState(false)
  const [proposals, setProposals] = useState<CompletionProposal[]>([])

  // Pre-completion requirements state
  const [requirements, setRequirements] = useState([
    {
      id: "1",
      title: "Contract signed by all parties",
      description: "Ensure all parties have signed the purchase contract",
      category: "legal",
      priority: "high" as const,
      completed: true,
      completedDate: "2024-04-20T14:30:00Z",
      dueDate: "2024-04-25",
      overdue: false,
      notes: "Completed ahead of schedule",
    },
    {
      id: "2",
      title: "Mortgage funds confirmed",
      description: "Confirmation from lender that funds are available",
      category: "financial",
      priority: "high" as const,
      completed: true,
      completedDate: "2024-04-22T10:15:00Z",
      dueDate: "2024-04-30",
      overdue: false,
      notes: "Funds confirmed and ready for release",
    },
    {
      id: "3",
      title: "Buildings insurance arranged",
      description: "Property insurance policy in place from completion date",
      category: "insurance",
      priority: "high" as const,
      completed: true,
      completedDate: "2024-04-21T16:45:00Z",
      dueDate: "2024-05-01",
      overdue: false,
      notes: "",
    },
    {
      id: "4",
      title: "Final searches updated",
      description: "Local authority and environmental searches are current",
      category: "legal",
      priority: "medium" as const,
      completed: false,
      dueDate: "2024-05-15",
      overdue: false,
      notes: "Awaiting updated local authority search results",
    },
    {
      id: "5",
      title: "Completion statement prepared",
      description: "Final completion statement with all costs calculated",
      category: "financial",
      priority: "medium" as const,
      completed: false,
      dueDate: "2024-05-20",
      overdue: false,
      notes: "",
    },
    {
      id: "6",
      title: "Keys and access arrangements",
      description: "Coordinate key handover and property access",
      category: "property",
      priority: "low" as const,
      completed: false,
      dueDate: "2024-05-25",
      overdue: false,
      notes: "",
    },
  ])

  const [requirementFilter, setRequirementFilter] = useState("all")
  const [requirementSort, setRequirementSort] = useState("priority")
  const [showAddRequirement, setShowAddRequirement] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null)
  const [newRequirement, setNewRequirement] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "medium" as const,
    dueDate: "",
  })

  const { updates, sendUpdate, markAsRead } = useRealTime()
  const { toast } = useToast()

  // Function to check if both conveyancers have agreed on a completion date
  const haveBothConveyancersAgreed = () => {
    // Check if there's an accepted proposal from either conveyancer
    const acceptedProposal = proposals.find((p) => p.status === "accepted")
    return acceptedProposal !== undefined
  }

  // Load requirements from localStorage on mount
  useEffect(() => {
    const storedRequirements = localStorage.getItem("completion_requirements")
    if (storedRequirements) {
      try {
        const parsed = JSON.parse(storedRequirements)
        // Check for overdue items
        const updated = parsed.map((req: any) => ({
          ...req,
          overdue: req.dueDate && !req.completed && new Date(req.dueDate) < new Date(),
        }))
        setRequirements(updated)
      } catch (error) {
        console.error("Error loading requirements:", error)
      }
    }
  }, [])

  // Save requirements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("completion_requirements", JSON.stringify(requirements))
  }, [requirements])

  // Check for overdue items periodically
  useEffect(() => {
    const checkOverdue = () => {
      setRequirements((prev) =>
        prev.map((req) => ({
          ...req,
          overdue: req.dueDate && !req.completed && new Date(req.dueDate) < new Date(),
        })),
      )
    }

    const interval = setInterval(checkOverdue, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const getFilteredRequirements = () => {
    let filtered = requirements

    // Apply filter
    switch (requirementFilter) {
      case "pending":
        filtered = filtered.filter((r) => !r.completed)
        break
      case "completed":
        filtered = filtered.filter((r) => r.completed)
        break
      case "overdue":
        filtered = filtered.filter((r) => r.overdue)
        break
    }

    // Apply sort
    switch (requirementSort) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        filtered = filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        break
      case "dueDate":
        filtered = filtered.sort((a, b) => {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
      case "status":
        filtered = filtered.sort((a, b) => {
          if (a.completed === b.completed) return 0
          return a.completed ? 1 : -1
        })
        break
      case "category":
        filtered = filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
    }

    return filtered
  }

  const handleToggleRequirement = async (id: string) => {
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const updated = {
            ...req,
            completed: !req.completed,
            completedDate: !req.completed ? new Date().toISOString() : undefined,
          }
          return updated
        }
        return req
      }),
    )

    const requirement = requirements.find((r) => r.id === id)
    if (requirement) {
      try {
        await sendUpdate({
          type: "status_changed",
          stage: "completion-date",
          role: "buyer-conveyancer",
          title: `Requirement ${requirement.completed ? "Unchecked" : "Completed"}`,
          description: `${requirement.title} has been ${requirement.completed ? "unchecked" : "marked as complete"}`,
          data: {
            requirementId: id,
            requirementTitle: requirement.title,
            completed: !requirement.completed,
          },
        })

        toast({
          title: requirement.completed ? "Requirement Unchecked" : "Requirement Completed",
          description: requirement.title,
          variant: requirement.completed ? "default" : "default",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update requirement status",
          variant: "destructive",
        })
      }
    }
  }

  const handleAddRequirement = () => {
    if (!newRequirement.title) return

    const requirement = {
      id: Date.now().toString(),
      title: newRequirement.title,
      description: newRequirement.description,
      category: newRequirement.category,
      priority: newRequirement.priority,
      completed: false,
      dueDate: newRequirement.dueDate || undefined,
      overdue: false,
      notes: "",
    }

    setRequirements((prev) => [...prev, requirement])
    setNewRequirement({
      title: "",
      description: "",
      category: "other",
      priority: "medium",
      dueDate: "",
    })
    setShowAddRequirement(false)

    toast({
      title: "Requirement Added",
      description: requirement.title,
    })
  }

  const handleUpdateRequirement = (id: string, updates: Partial<(typeof requirements)[0]>) => {
    setRequirements((prev) => prev.map((req) => (req.id === id ? { ...req, ...updates } : req)))
  }

  const handleDeleteRequirement = (id: string) => {
    const requirement = requirements.find((r) => r.id === id)
    if (requirement) {
      setRequirements((prev) => prev.filter((req) => req.id !== id))
      toast({
        title: "Requirement Deleted",
        description: requirement.title,
      })
    }
  }

  const handleMarkAllComplete = () => {
    setRequirements((prev) =>
      prev.map((req) => ({
        ...req,
        completed: true,
        completedDate: req.completed ? req.completedDate : new Date().toISOString(),
      })),
    )

    toast({
      title: "All Requirements Completed",
      description: "All pre-completion requirements have been marked as complete",
    })
  }

  const handleSendRequirementsUpdate = async () => {
    const completedCount = requirements.filter((r) => r.completed).length
    const totalCount = requirements.length
    const overdueCount = requirements.filter((r) => r.overdue).length

    try {
      await sendUpdate({
        type: "status_changed",
        stage: "completion-date",
        role: "buyer-conveyancer",
        title: "Requirements Update",
        description: `${completedCount}/${totalCount} pre-completion requirements completed${overdueCount > 0 ? ` (${overdueCount} overdue)` : ""}`,
        data: {
          completedCount,
          totalCount,
          overdueCount,
          requirements: requirements.map((r) => ({
            id: r.id,
            title: r.title,
            completed: r.completed,
            overdue: r.overdue,
          })),
        },
      })

      toast({
        title: "Update Sent",
        description: "Requirements status sent to all parties",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send requirements update",
        variant: "destructive",
      })
    }
  }

  // Load proposals from localStorage on mount
  useEffect(() => {
    const storedProposals = getStoredProposals()
    if (storedProposals.length === 0) {
      // Initialize with default proposal if none exist
      const defaultProposal: CompletionProposal = {
        id: "1",
        date: "2024-05-28",
        time: "14:00",
        proposedBy: "buyer-conveyancer",
        reason: "Initial proposal based on mortgage offer timeline",
        status: "pending",
        timestamp: "2024-04-23T10:00:00Z",
      }
      setProposals([defaultProposal])
      storeProposals([defaultProposal])
    } else {
      setProposals(storedProposals)
    }
  }, [])

  // Listen for storage changes (proposals from other pages)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "completion_proposals" && e.newValue) {
        try {
          const newProposals = JSON.parse(e.newValue)
          setProposals(newProposals)
        } catch (error) {
          console.error("Error parsing storage proposals:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Listen for confirmation updates from real-time context
  useEffect(() => {
    const completionUpdates = updates.filter(
      (update) =>
        (update.type === "completion_date_proposed" ||
          update.type === "completion_date_confirmed" ||
          update.type === "completion_date_rejected") &&
        !update.read,
    )

    completionUpdates.forEach((update) => {
      // Handle updates from seller conveyancer
      if (update.data?.proposedBy === "seller-conveyancer" || update.role === "seller-conveyancer") {
        if (update.type === "completion_date_proposed") {
          const proposal = update.data.proposal
          if (proposal) {
            setProposals((prev) => {
              const exists = prev.find((p) => p.id === proposal.id)
              if (!exists) {
                const newProposals = [proposal, ...prev]
                storeProposals(newProposals)
                return newProposals
              }
              return prev
            })
            // Update the main proposed date to show the latest proposal
            setProposedDate(proposal.date)
            setShowProposals(true)
            toast({
              title: "New Completion Date Proposed",
              description: `Seller conveyancer proposed ${new Date(proposal.date).toLocaleDateString()} at ${proposal.time}`,
            })
          }
        } else if (update.type === "completion_date_confirmed") {
          // When seller conveyancer confirms a date
          if (update.data.date) {
            setDateConfirmed(true)
            setProposedDate(update.data.date)

            // Update the specific proposal status if proposalId is provided
            if (update.data.proposalId) {
              setProposals((prev) => {
                const newProposals = prev.map((p) =>
                  p.id === update.data.proposalId ? { ...p, status: "accepted" } : p,
                )
                storeProposals(newProposals)
                return newProposals
              })
            }

            toast({
              title: "Completion Date Confirmed",
              description: `Seller conveyancer confirmed ${new Date(update.data.date).toLocaleDateString()}`,
            })
          }
        } else if (update.type === "completion_date_rejected") {
          if (update.data.proposalId) {
            setProposals((prev) => {
              const newProposals = prev.map((p) => (p.id === update.data.proposalId ? { ...p, status: "rejected" } : p))
              storeProposals(newProposals)
              return newProposals
            })

            toast({
              title: "Proposal Rejected",
              description: "Seller conveyancer rejected the completion date proposal",
              variant: "destructive",
            })
          }
        }
      }

      // Handle updates from buyer conveyancer (own updates)
      if (update.data?.proposedBy === "buyer-conveyancer" || update.role === "buyer-conveyancer") {
        if (update.type === "completion_date_confirmed" && update.data.confirmedBy === "seller-conveyancer") {
          // Seller conveyancer confirmed our proposal
          setDateConfirmed(true)
          if (update.data.proposalId) {
            setProposals((prev) => {
              const newProposals = prev.map((p) => (p.id === update.data.proposalId ? { ...p, status: "accepted" } : p))
              storeProposals(newProposals)
              return newProposals
            })
          }
        }
      }

      markAsRead(update.id)
    })
  }, [updates, markAsRead, toast])

  // Listen for proposal changes from localStorage (other tabs/pages)
  useEffect(() => {
    const handleProposalStorageChange = () => {
      const storedProposals = getStoredProposals()
      setProposals(storedProposals)

      // Update proposed date to the latest accepted or most recent proposal
      const latestAccepted = storedProposals.find((p) => p.status === "accepted")
      const latestProposal = storedProposals[0]

      if (latestAccepted) {
        setProposedDate(latestAccepted.date)
        setDateConfirmed(true)
      } else if (latestProposal) {
        setProposedDate(latestProposal.date)
      }
    }

    // Check for changes every second
    const interval = setInterval(handleProposalStorageChange, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleConfirmDate = async () => {
    try {
      setDateConfirmed(true)

      await sendUpdate({
        type: "completion_date_confirmed",
        stage: "completion-date",
        role: "buyer-conveyancer",
        title: "Completion Date Confirmed",
        description: `Completion date confirmed: ${new Date(proposedDate).toLocaleDateString()}`,
        data: {
          date: proposedDate,
          confirmedBy: "buyer-conveyancer",
        },
      })

      toast({
        title: "Date Confirmed",
        description: "Completion date has been confirmed and sent to all parties",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm completion date",
        variant: "destructive",
      })
    }
  }

  const handleDateChange = async (newDate: string) => {
    setProposedDate(newDate)

    await sendUpdate({
      type: "completion_date_proposed",
      stage: "completion-date",
      role: "buyer-conveyancer",
      title: "Completion Date Proposed",
      description: `New completion date proposed: ${new Date(newDate).toLocaleDateString()}`,
      data: {
        date: newDate,
        proposedBy: "buyer-conveyancer",
      },
    })

    toast({
      title: "Date Proposed",
      description: "New completion date sent to all parties",
    })
  }

  // Validate proposed date
  const validateDate = (date: string) => {
    const proposedDate = new Date(date)
    const today = new Date()
    const dayOfWeek = proposedDate.getDay()

    const issues = []

    if (proposedDate <= today) {
      issues.push("Date cannot be in the past")
    }

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      issues.push("Completion typically occurs on weekdays")
    }

    const daysUntil = Math.ceil((proposedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil < 14) {
      issues.push("Minimum 14 days notice typically required")
    }

    // Check for bank holidays (simplified)
    const bankHolidays = ["2024-05-06", "2024-05-27", "2024-08-26"]
    if (bankHolidays.includes(date)) {
      issues.push("Date falls on a bank holiday")
    }

    return issues
  }

  const handleProposeDate = async () => {
    if (!newDate || !reason) {
      toast({
        title: "Missing Information",
        description: "Please select a date and provide a reason",
        variant: "destructive",
      })
      return
    }

    const validationIssues = validateDate(newDate)
    if (validationIssues.length > 0) {
      toast({
        title: "Date Validation Issues",
        description: validationIssues.join(". "),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newProposal: CompletionProposal = {
        id: Date.now().toString(),
        date: newDate,
        time: newTime,
        proposedBy: "buyer-conveyancer",
        reason: reason === "other" ? customReason : reason,
        status: "pending",
        timestamp: new Date().toISOString(),
      }

      setProposals((prev) => {
        const newProposals = [newProposal, ...prev]
        storeProposals(newProposals)
        return newProposals
      })
      setProposedDate(newDate)

      // Send real-time update
      await sendUpdate({
        type: "completion_date_proposed",
        stage: "completion-date",
        role: "buyer-conveyancer",
        title: "New Completion Date Proposed",
        description: `New completion date proposed: ${new Date(newDate).toLocaleDateString()} at ${newTime}`,
        data: {
          proposal: newProposal,
          proposedBy: "buyer-conveyancer",
        },
      })

      toast({
        title: "Date Proposed",
        description: "Completion date proposal sent to all parties",
      })

      // Reset form
      setIsProposing(false)
      setNewDate("")
      setNewTime("14:00")
      setReason("")
      setCustomReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to propose completion date",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const reasonOptions = [
    { value: "mortgage_timeline", label: "Mortgage offer timeline" },
    { value: "chain_coordination", label: "Property chain coordination" },
    { value: "survey_completion", label: "Survey completion requirements" },
    { value: "legal_requirements", label: "Legal documentation timeline" },
    { value: "client_preference", label: "Client availability preference" },
    { value: "other", label: "Other (specify)" },
  ]

  const handleAcceptProposal = async (proposalId: string) => {
    const proposal = proposals.find((p) => p.id === proposalId)
    if (!proposal) return

    try {
      setProposals((prev) => {
        const newProposals = prev.map((p) => (p.id === proposalId ? { ...p, status: "accepted" } : p))
        storeProposals(newProposals)
        return newProposals
      })
      setProposedDate(proposal.date)
      setDateConfirmed(true)

      await sendUpdate({
        type: "completion_date_confirmed",
        stage: "completion-date",
        role: "buyer-conveyancer",
        title: "Completion Date Accepted",
        description: `Accepted completion date: ${new Date(proposal.date).toLocaleDateString()}`,
        data: {
          date: proposal.date,
          proposalId: proposalId,
          confirmedBy: "buyer-conveyancer",
        },
      })

      toast({
        title: "Proposal Accepted",
        description: "Completion date proposal has been accepted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive",
      })
    }
  }

  const handleRejectProposal = async (proposalId: string) => {
    try {
      setProposals((prev) => {
        const newProposals = prev.map((p) => (p.id === proposalId ? { ...p, status: "rejected" } : p))
        storeProposals(newProposals)
        return newProposals
      })

      await sendUpdate({
        type: "completion_date_rejected",
        stage: "completion-date",
        role: "buyer-conveyancer",
        title: "Completion Date Rejected",
        description: "Completion date proposal has been rejected",
        data: {
          proposalId: proposalId,
          rejectedBy: "buyer-conveyancer",
        },
      })

      toast({
        title: "Proposal Rejected",
        description: "Completion date proposal has been rejected",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject proposal",
        variant: "destructive",
      })
    }
  }

  return (
    <TransactionLayout
      currentStage="completion-date"
      userRole="buyer-conveyancer"
      title="Completion Date Coordination"
      description="Coordinate and confirm the completion date with all parties"
    >
      <div className="space-y-6">
        {/* Propose a Completion Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Propose a Completion Date
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsProposing(!isProposing)}>
                  <Edit className="h-4 w-4 mr-1" />
                  {isProposing ? "Cancel" : "Propose New Date"}
                </Button>
                {proposals.some((p) => p.proposedBy === "seller-conveyancer" && p.status === "pending") && (
                  <Button variant="outline" size="sm" onClick={() => setShowProposals(!showProposals)}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    New Proposals (
                    {proposals.filter((p) => p.proposedBy === "seller-conveyancer" && p.status === "pending").length})
                  </Button>
                )}
              </div>
            </CardTitle>
            <CardDescription>Coordinate completion date with all parties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`flex items-center justify-between p-4 border rounded-lg ${
                dateConfirmed ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {dateConfirmed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <div className="font-medium">
                    {dateConfirmed ? "Completion Date Confirmed" : "Completion Date Pending"}
                  </div>
                  <div className="text-sm text-grey-600">
                    {dateConfirmed ? "All parties have agreed" : "Awaiting confirmation from all parties"}
                  </div>
                </div>
              </div>
              <Badge variant={dateConfirmed ? "default" : "secondary"}>{dateConfirmed ? "Confirmed" : "Pending"}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposed-date">Proposed Completion Date</Label>
                <Input
                  id="proposed-date"
                  type="date"
                  value={proposedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  disabled={!haveBothConveyancersAgreed()}
                  className={!haveBothConveyancersAgreed() ? "opacity-50 cursor-not-allowed bg-grey-100" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Days Until Completion</Label>
                <div
                  className={`p-2 rounded border ${!haveBothConveyancersAgreed() ? "bg-grey-100 opacity-50 cursor-not-allowed" : "bg-grey-50"}`}
                >
                  <span className="text-lg font-bold">
                    {Math.ceil((new Date(proposedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Proposal Form */}
        {isProposing && (
          <Card>
            <CardHeader>
              <CardTitle>Propose New Completion Date</CardTitle>
              <CardDescription>Submit a new completion date proposal to all parties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-date">Completion Date</Label>
                  <Input
                    id="new-date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {newDate && validateDate(newDate).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {validateDate(newDate).map((issue, index) => (
                        <p key={index} className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {issue}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="new-time">Completion Time</Label>
                  <Select value={newTime} onValueChange={setNewTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Date Change</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reason === "other" && (
                <div>
                  <Label htmlFor="custom-reason">Please specify</Label>
                  <Textarea
                    id="custom-reason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter the reason for this completion date..."
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleProposeDate} disabled={isSubmitting || !newDate || !reason}>
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? "Sending..." : "Send Proposal"}
                </Button>
                <Button variant="outline" onClick={() => setIsProposing(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Proposals from Seller Conveyancer */}
        {proposals.some((p) => p.proposedBy === "seller-conveyancer" && p.status === "pending") && (
          <Card>
            <CardHeader>
              <CardTitle>New Completion Date Proposals</CardTitle>
              <CardDescription>Review proposals from seller conveyancer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proposals
                  .filter((p) => p.proposedBy === "seller-conveyancer" && p.status === "pending")
                  .map((proposal) => (
                    <div key={proposal.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-lg">
                            {formatDate(proposal.date)} at {proposal.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Proposed by {proposal.proposedBy} • {new Date(proposal.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="secondary">Pending Review</Badge>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm">
                          <strong>Reason:</strong> {proposal.reason}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleAcceptProposal(proposal.id)} size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button variant="destructive" onClick={() => handleRejectProposal(proposal.id)} size="sm">
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proposal History */}
        {showHistory && (
          <Card>
            <CardHeader>
              <CardTitle>Proposal History</CardTitle>
              <CardDescription>Complete history of completion date proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">
                        {formatDate(proposal.date)} at {proposal.time}
                      </div>
                      <Badge
                        variant={
                          proposal.status === "accepted"
                            ? "default"
                            : proposal.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Proposed by {proposal.proposedBy} • {new Date(proposal.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{proposal.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pre-Completion Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pre-Completion Requirements
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {requirements.filter((r) => r.completed).length} of {requirements.length} Complete
                </Badge>
                <div className="w-24 bg-grey-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(requirements.filter((r) => r.completed).length / requirements.length) * 100}%`,
                    }}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddRequirement(!showAddRequirement)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Track completion of all requirements before the completion date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter and Sort Options */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Select value={requirementFilter} onValueChange={setRequirementFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={requirementSort} onValueChange={setRequirementSort}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">By Priority</SelectItem>
                  <SelectItem value="dueDate">By Due Date</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-muted-foreground">
                {getFilteredRequirements().length} of {requirements.length} items shown
              </div>
            </div>

            {/* Add New Requirement Form */}
            {showAddRequirement && (
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-req-title">Requirement Title</Label>
                      <Input
                        id="new-req-title"
                        value={newRequirement.title}
                        onChange={(e) => setNewRequirement((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter requirement title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-req-category">Category</Label>
                      <Select
                        value={newRequirement.category}
                        onValueChange={(value) => setNewRequirement((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="new-req-priority">Priority</Label>
                      <Select
                        value={newRequirement.priority}
                        onValueChange={(value) =>
                          setNewRequirement((prev) => ({ ...prev, priority: value as "high" | "medium" | "low" }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="new-req-due">Due Date</Label>
                      <Input
                        id="new-req-due"
                        type="date"
                        value={newRequirement.dueDate}
                        onChange={(e) => setNewRequirement((prev) => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="new-req-description">Description (Optional)</Label>
                    <Textarea
                      id="new-req-description"
                      value={newRequirement.description}
                      onChange={(e) => setNewRequirement((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Add any additional details..."
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddRequirement} disabled={!newRequirement.title}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Requirement
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddRequirement(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements List */}
            <div className="space-y-3">
              {getFilteredRequirements().map((requirement) => (
                <div
                  key={requirement.id}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    requirement.completed
                      ? "bg-green-50 border-green-200"
                      : requirement.overdue
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-grey-200 hover:border-grey-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleRequirement(requirement.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        requirement.completed
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-grey-300 hover:border-grey-400"
                      }`}
                    >
                      {requirement.completed && <CheckCircle className="h-3 w-3" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium text-sm ${requirement.completed ? "line-through text-grey-500" : ""}`}
                          >
                            {requirement.title}
                          </h4>
                          <Badge
                            variant={
                              requirement.priority === "high"
                                ? "destructive"
                                : requirement.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {requirement.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {requirement.category}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          {requirement.dueDate && (
                            <span
                              className={`text-xs ${
                                requirement.overdue
                                  ? "text-red-600"
                                  : new Date(requirement.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                    ? "text-yellow-600"
                                    : "text-grey-500"
                              }`}
                            >
                              Due: {new Date(requirement.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingRequirement(requirement.id === editingRequirement ? null : requirement.id)
                            }
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRequirement(requirement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {requirement.description && (
                        <p className={`text-sm text-grey-600 mb-2 ${requirement.completed ? "line-through" : ""}`}>
                          {requirement.description}
                        </p>
                      )}

                      {requirement.completedDate && (
                        <p className="text-xs text-green-600">
                          Completed on {new Date(requirement.completedDate).toLocaleDateString()} at{" "}
                          {new Date(requirement.completedDate).toLocaleTimeString()}
                        </p>
                      )}

                      {requirement.notes && (
                        <div className="mt-2 p-2 bg-grey-50 rounded text-xs">
                          <strong>Notes:</strong> {requirement.notes}
                        </div>
                      )}

                      {/* Edit Form */}
                      {editingRequirement === requirement.id && (
                        <div className="mt-3 p-3 border rounded bg-grey-50">
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Notes</Label>
                              <Textarea
                                value={requirement.notes || ""}
                                onChange={(e) => handleUpdateRequirement(requirement.id, { notes: e.target.value })}
                                placeholder="Add notes about this requirement..."
                                rows={2}
                                className="text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Priority</Label>
                                <Select
                                  value={requirement.priority}
                                  onValueChange={(value) =>
                                    handleUpdateRequirement(requirement.id, {
                                      priority: value as "high" | "medium" | "low",
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Due Date</Label>
                                <Input
                                  type="date"
                                  value={requirement.dueDate || ""}
                                  onChange={(e) => handleUpdateRequirement(requirement.id, { dueDate: e.target.value })}
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => setEditingRequirement(null)}>
                                Save
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingRequirement(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredRequirements().length === 0 && (
              <div className="text-center py-8 text-grey-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-grey-300" />
                <p>No requirements match the current filter</p>
                <Button variant="outline" onClick={() => setRequirementFilter("all")} className="mt-2">
                  Show All Requirements
                </Button>
              </div>
            )}

            {/* Summary Actions */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {requirements.filter((r) => r.completed).length === requirements.length
                    ? "All pre-completion requirements have been satisfied"
                    : `${requirements.filter((r) => !r.completed).length} requirement(s) still pending`}
                  {requirements.some((r) => r.overdue) && (
                    <span className="text-red-600 ml-2">• {requirements.filter((r) => r.overdue).length} overdue</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllComplete}
                    disabled={requirements.every((r) => r.completed)}
                  >
                    Mark All Complete
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSendRequirementsUpdate}>
                    <Send className="h-4 w-4 mr-1" />
                    Send Update
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Notes</CardTitle>
            <CardDescription>Record important notes about the completion arrangements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="completion-notes">Notes</Label>
              <Textarea
                id="completion-notes"
                placeholder="Record any special arrangements, concerns, or important details about the completion..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button>Save Notes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Potential Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Potential Issues
            </CardTitle>
            <CardDescription>Factors that could affect the completion date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-yellow-400 pl-4 py-2">
              <h4 className="font-medium text-sm">Chain Dependencies</h4>
              <p className="text-sm text-muted-foreground">Seller's onward purchase completion date must align</p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4 py-2">
              <h4 className="font-medium text-sm">Bank Holiday Period</h4>
              <p className="text-sm text-muted-foreground">Proposed date avoids upcoming bank holiday weekend</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/buyer-conveyancer/contract-exchange">Continue to Contract Exchange</Link>
          </Button>
        </div>
      </div>
    </TransactionLayout>
  )
}
