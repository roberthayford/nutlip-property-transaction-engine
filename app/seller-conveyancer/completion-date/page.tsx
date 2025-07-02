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
import { Calendar, Clock, CheckCircle, AlertTriangle, History, Edit, Send, X } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"

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

export default function SellerConveyancerCompletionDatePage() {
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
  const { updates, sendUpdate, markAsRead } = useRealTime()
  const { toast } = useToast()

  // Function to check if both conveyancers have agreed on a completion date
  const haveBothConveyancersAgreed = () => {
    // Check if there's an accepted proposal from either conveyancer
    const acceptedProposal = proposals.find((p) => p.status === "accepted")
    return acceptedProposal !== undefined
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
        proposedBy: "seller-conveyancer",
        reason: "Initial proposal based on chain coordination",
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

  // Listen for real-time updates from buyer conveyancer
  useEffect(() => {
    const completionUpdates = updates.filter(
      (update) =>
        (update.type === "completion_date_proposed" ||
          update.type === "completion_date_confirmed" ||
          update.type === "completion_date_rejected") &&
        !update.read,
    )

    completionUpdates.forEach((update) => {
      // Handle updates from buyer conveyancer
      if (update.data?.proposedBy === "buyer-conveyancer" || update.role === "buyer-conveyancer") {
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
              description: `Buyer conveyancer proposed ${new Date(proposal.date).toLocaleDateString()} at ${proposal.time}`,
            })
          }
        } else if (update.type === "completion_date_confirmed") {
          // When buyer conveyancer confirms a date
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
              description: `Buyer conveyancer confirmed ${new Date(update.data.date).toLocaleDateString()}`,
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
              description: "Buyer conveyancer rejected the completion date proposal",
              variant: "destructive",
            })
          }
        }
      }

      // Handle updates from seller conveyancer (own updates)
      if (update.data?.proposedBy === "seller-conveyancer" || update.role === "seller-conveyancer") {
        if (update.type === "completion_date_confirmed" && update.data.confirmedBy === "buyer-conveyancer") {
          // Buyer conveyancer confirmed our proposal
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
        role: "seller-conveyancer",
        title: "Completion Date Confirmed",
        description: `Completion date confirmed: ${new Date(proposedDate).toLocaleDateString()}`,
        data: {
          date: proposedDate,
          confirmedBy: "seller-conveyancer",
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
      role: "seller-conveyancer",
      title: "Completion Date Proposed",
      description: `New completion date proposed: ${new Date(newDate).toLocaleDateString()}`,
      data: {
        date: newDate,
        proposedBy: "seller-conveyancer",
      },
    })

    toast({
      title: "Date Proposed",
      description: "New completion date sent to all parties",
    })
  }

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
        role: "seller-conveyancer",
        title: "Completion Date Accepted",
        description: `Accepted completion date: ${new Date(proposal.date).toLocaleDateString()}`,
        data: {
          date: proposal.date,
          proposalId: proposalId,
          confirmedBy: "seller-conveyancer",
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
        role: "seller-conveyancer",
        title: "Completion Date Rejected",
        description: "Completion date proposal has been rejected",
        data: {
          proposalId: proposalId,
          rejectedBy: "seller-conveyancer",
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
        proposedBy: "seller-conveyancer",
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
        role: "seller-conveyancer",
        title: "New Completion Date Proposed",
        description: `New completion date proposed: ${new Date(newDate).toLocaleDateString()} at ${newTime}`,
        data: {
          proposal: newProposal,
          proposedBy: "seller-conveyancer",
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
    { value: "chain_coordination", label: "Property chain coordination" },
    { value: "client_availability", label: "Client availability" },
    { value: "legal_requirements", label: "Legal documentation timeline" },
    { value: "financial_arrangements", label: "Financial arrangements" },
    { value: "property_preparation", label: "Property preparation requirements" },
    { value: "other", label: "Other (specify)" },
  ]

  return (
    <TransactionLayout title="Completion Date Coordination" stage="completion-date" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Completion Date Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Completion Date Status
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsProposing(!isProposing)}>
                  <Edit className="h-4 w-4 mr-1" />
                  {isProposing ? "Cancel" : "Propose New Date"}
                </Button>
                {proposals.some((p) => p.proposedBy === "buyer-conveyancer" && p.status === "pending") && (
                  <Button variant="outline" size="sm" onClick={() => setShowProposals(!showProposals)}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    New Proposals (
                    {proposals.filter((p) => p.proposedBy === "buyer-conveyancer" && p.status === "pending").length})
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
                  <div className="text-sm text-gray-600">
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
                  className={!haveBothConveyancersAgreed() ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Days Until Completion</Label>
                <div
                  className={`p-2 rounded border ${!haveBothConveyancersAgreed() ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-gray-50"}`}
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

        {/* New Proposals from Buyer Conveyancer */}
        {showProposals && proposals.some((p) => p.proposedBy === "buyer-conveyancer" && p.status === "pending") && (
          <Card>
            <CardHeader>
              <CardTitle>New Completion Date Proposals</CardTitle>
              <CardDescription>Review proposals from buyer conveyancer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proposals
                  .filter((p) => p.proposedBy === "buyer-conveyancer" && p.status === "pending")
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

        {/* Completion Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Completion Requirements</CardTitle>
            <CardDescription>Items that must be completed before the completion date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { item: "Contract exchange completed", completed: false, critical: true },
                { item: "Final searches completed", completed: false, critical: true },
                { item: "Mortgage funds confirmed available", completed: true, critical: true },
                { item: "Completion statement prepared", completed: false, critical: false },
                { item: "Keys and documents ready for handover", completed: false, critical: false },
                { item: "Final meter readings arranged", completed: false, critical: false },
              ].map((req, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {req.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className={`text-sm ${req.completed ? "text-gray-900" : "text-gray-600"}`}>{req.item}</span>
                    {req.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                  </div>
                  {!req.completed && (
                    <Button size="sm" variant="outline">
                      Complete
                    </Button>
                  )}
                </div>
              ))}
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

        {/* Important Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Timing Coordination</p>
                <p className="text-amber-700">
                  Ensure all parties can meet the proposed completion date before confirming. Consider mortgage offer
                  expiry dates.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Client Communication</p>
                <p className="text-blue-700">
                  Keep your client informed of the completion date and any requirements for their attendance or
                  preparation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
