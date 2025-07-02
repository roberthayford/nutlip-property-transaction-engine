"use client"

import { useState, useEffect } from "react"
import { TransactionLayout } from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, MessageSquare, Clock, CheckCircle, Send, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { RefreshCw, Download, Bell, Eye, BarChart3, X, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRealTime } from "@/contexts/real-time-context"

interface Requisition {
  id: string
  title: string
  description: string
  status: "pending" | "replied" | "urgent"
  priority: "high" | "medium" | "low"
  receivedDate: string
  dueDate: string
  repliedDate?: string
  reply?: string
  sentByMe?: boolean
  referenceNumber?: string
}

interface SentRequisition {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  urgency: string
  dueDate: string
  sentDate: string
  sentTime: string
  status: "sent" | "acknowledged" | "replied"
  referenceNumber: string
  recipientConfirmation?: string
  notes?: string
  reply?: string
  repliedDate?: string
  repliedTime?: string
}

export default function BuyerConveyancerRepliesToRequisitionsPage() {
  const { toast } = useToast()
  const { sendUpdate } = useRealTime()
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [requisitions, setRequisitions] = useState<Requisition[]>([])
  const [sentRequisitions, setSentRequisitions] = useState<SentRequisition[]>([])
  const [urgentReply, setUrgentReply] = useState("")
  const [showSentProof, setShowSentProof] = useState<SentRequisition | null>(null)
  const [showNewRequisitionForm, setShowNewRequisitionForm] = useState(false)

  // New Requisition State
  const [newRequisition, setNewRequisition] = useState({
    subject: "",
    customSubject: "",
    priority: "medium" as "high" | "medium" | "low",
    urgency: "standard",
    dueDate: "",
    details: "",
    notes: "",
  })

  // Generate reference number
  const generateReferenceNumber = () => {
    const date = new Date()
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "")
    const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "")
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `REQ-${dateStr}-${timeStr}-${random}`
  }

  // Handle sending new requisition
  const handleSendRequisition = () => {
    if (!newRequisition.subject || !newRequisition.details.trim() || !newRequisition.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before sending",
        variant: "destructive",
      })
      return
    }

    const subjectMap: { [key: string]: string } = {
      "final-completion-statement": "Final Completion Statement",
      "deposit-confirmation": "Deposit Confirmation",
      "mortgage-funds-confirmation": "Mortgage Funds Confirmation",
      "completion-arrangements": "Completion Arrangements",
      "title-deeds-delivery": "Title Deeds Delivery",
      "vacant-possession": "Vacant Possession Confirmation",
      "property-boundaries": "Property Boundaries",
      "insurance-policy-details": "Insurance Policy Details",
      "utilities-transfer": "Utilities Transfer",
      "key-collection": "Key Collection Arrangements",
      "outstanding-charges": "Outstanding Charges/Mortgages",
      "legal-pack-documents": "Legal Pack Documents",
      "property-information-forms": "Property Information Forms",
      "planning-permissions": "Planning Permissions",
      "building-regulations": "Building Regulations Approval",
      "warranties-guarantees": "Warranties & Guarantees",
      "local-authority-searches": "Local Authority Searches",
      "environmental-searches": "Environmental Searches",
      "water-drainage-searches": "Water & Drainage Searches",
      "chancel-repair-liability": "Chancel Repair Liability",
      "service-charge-information": "Service Charge Information",
      "ground-rent-details": "Ground Rent Details",
      "management-company-details": "Management Company Details",
      "indemnity-policies": "Indemnity Policies",
      "fixtures-fittings": "Fixtures & Fittings",
      "meter-readings": "Meter Readings",
      "property-condition": "Property Condition",
      "access-rights": "Access Rights & Easements",
      "restrictive-covenants": "Restrictive Covenants",
      apportionments: "Apportionments & Adjustments",
      custom: newRequisition.customSubject,
    }

    const now = new Date()
    const referenceNumber = generateReferenceNumber()

    const newSentReq: SentRequisition = {
      id: `sent-${Date.now()}`,
      title: subjectMap[newRequisition.subject] || newRequisition.subject,
      description:
        newRequisition.details + (newRequisition.notes ? `\n\nAdditional Notes: ${newRequisition.notes}` : ""),
      priority: newRequisition.priority,
      urgency: newRequisition.urgency,
      dueDate: newRequisition.dueDate,
      sentDate: now.toISOString().split("T")[0],
      sentTime: now.toTimeString().split(" ")[0],
      status: "sent",
      referenceNumber,
      notes: newRequisition.notes,
    }

    // Add to sent requisitions
    const updatedSentRequisitions = [...sentRequisitions, newSentReq]
    setSentRequisitions(updatedSentRequisitions)
    localStorage.setItem("buyer-sent-requisitions", JSON.stringify(updatedSentRequisitions))

    // Add to main requisitions state for overview display
    const newRequisitionForOverview = {
      id: newSentReq.id,
      title: newSentReq.title,
      description: newSentReq.description,
      status: "pending" as const,
      priority: newSentReq.priority,
      receivedDate: newSentReq.sentDate,
      dueDate: newSentReq.dueDate,
      sentByMe: true,
      referenceNumber: newSentReq.referenceNumber,
    }

    const updatedRequisitions = [...requisitions, newRequisitionForOverview]
    setRequisitions(updatedRequisitions)
    localStorage.setItem("buyer-conveyancer-requisitions", JSON.stringify(updatedRequisitions))

    // Add to seller's incoming requisitions
    const sellerRequisitions = JSON.parse(localStorage.getItem("seller-incoming-requisitions") || "[]")
    const sellerReq = {
      id: newSentReq.id,
      title: newSentReq.title,
      question: newSentReq.description,
      status: "pending",
      priority: newSentReq.priority,
      receivedDate: newSentReq.sentDate,
      referenceNumber: newSentReq.referenceNumber,
      fromBuyerConveyancer: true,
      urgency: newSentReq.urgency,
      dueDate: newSentReq.dueDate,
    }
    sellerRequisitions.push(sellerReq)
    localStorage.setItem("seller-incoming-requisitions", JSON.stringify(sellerRequisitions))

    // Send real-time update
    sendUpdate({
      type: "requisition_sent",
      stage: "replies-to-requisitions",
      role: "buyer-conveyancer",
      title: "New Requisition Sent",
      description: `Requisition "${newSentReq.title}" sent to seller's conveyancer`,
      data: { requisitionId: newSentReq.id, title: newSentReq.title },
    })

    // Show proof of sending
    setShowSentProof(newSentReq)

    // Clear form and hide it
    setNewRequisition({
      subject: "",
      customSubject: "",
      priority: "medium",
      urgency: "standard",
      dueDate: "",
      details: "",
      notes: "",
    })
    localStorage.setItem(
      "buyer-conveyancer-form-state",
      JSON.stringify({
        subject: "",
        customSubject: "",
        priority: "medium",
        urgency: "standard",
        dueDate: "",
        details: "",
        notes: "",
      }),
    )
    setShowNewRequisitionForm(false)

    toast({
      title: "Requisition Sent Successfully",
      description: `Reference: ${referenceNumber}`,
    })
  }

  // Handle saving as draft
  const handleSaveAsDraft = () => {
    if (!newRequisition.subject || !newRequisition.details.trim()) {
      toast({
        title: "Cannot Save Draft",
        description: "Please enter at least a subject and details",
        variant: "destructive",
      })
      return
    }

    const drafts = JSON.parse(localStorage.getItem("buyer-requisition-drafts") || "[]")
    const draft = {
      ...newRequisition,
      id: `draft-${Date.now()}`,
      savedAt: new Date().toISOString(),
    }
    drafts.push(draft)
    localStorage.setItem("buyer-requisition-drafts", JSON.stringify(drafts))

    toast({
      title: "Draft Saved",
      description: "Your requisition has been saved as a draft",
    })
  }

  // Handle clearing form
  const handleClearForm = () => {
    setNewRequisition({
      subject: "",
      customSubject: "",
      priority: "medium",
      urgency: "standard",
      dueDate: "",
      details: "",
      notes: "",
    })
    localStorage.setItem(
      "buyer-conveyancer-form-state",
      JSON.stringify({
        subject: "",
        customSubject: "",
        priority: "medium",
        urgency: "standard",
        dueDate: "",
        details: "",
        notes: "",
      }),
    )

    toast({
      title: "Form Cleared",
      description: "All fields have been reset",
    })
  }

  // Handle using template
  const handleUseTemplate = (template: any) => {
    setNewRequisition((prev) => ({
      ...prev,
      subject: template.subject,
      details: template.template,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    }))
    localStorage.setItem(
      "buyer-conveyancer-form-state",
      JSON.stringify({
        ...newRequisition,
        subject: template.subject,
        details: template.template,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }),
    )

    toast({
      title: "Template Applied",
      description: `Template for "${template.title}" has been applied`,
    })
  }

  // Copy reference number to clipboard
  const copyReferenceNumber = (refNumber: string) => {
    navigator.clipboard.writeText(refNumber)
    toast({
      title: "Reference Copied",
      description: "Reference number copied to clipboard",
    })
  }

  // Handle continue to completion - THIS IS THE KEY FUNCTION
  const handleContinueToCompletion = () => {
    // Store completion status in localStorage for immediate cross-tab sync
    const completionData = {
      status: "completed",
      completedBy: "Buyer Conveyancer",
      completedAt: new Date().toISOString(),
      totalRequisitions: 6,
      repliedRequisitions: 6,
      outstandingRequisitions: 0,
      nextStage: "Completion",
      completionDate: "2024-04-26T14:00:00Z",
    }

    localStorage.setItem("requisitions-completion-status", JSON.stringify(completionData))

    // Send real-time update to notify other pages
    sendUpdate({
      type: "requisitions_completed",
      stage: "replies-to-requisitions",
      role: "buyer-conveyancer",
      title: "All Requisitions Completed",
      description: "All completion requisitions have been resolved and the transaction is ready for completion",
      data: completionData,
    })

    // Also trigger a storage event for immediate cross-tab sync
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "requisitions-completion-status",
        newValue: JSON.stringify(completionData),
        storageArea: localStorage,
      }),
    )

    toast({
      title: "Requisitions Completed",
      description: "All requisitions resolved. Proceeding to completion stage.",
    })

    // Navigate to completion page after a brief delay
    setTimeout(() => {
      window.location.href = "/buyer-conveyancer/completion"
    }, 1500)
  }

  // ---------------------------------------------------------------------------
  // One-time listeners for cross-tab sync, browser-focus refresh, and platform
  // reset.  They do NOT depend on component state, preventing re-registration
  // loops.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "buyer-conveyancer-requisitions") {
        // Update requisitions when replies come in
        const updatedRequisitions = JSON.parse(e.newValue || "[]")
        setRequisitions(updatedRequisitions)

        // Check for new replies and show toast
        const currentRequisitions = JSON.parse(localStorage.getItem("buyer-conveyancer-requisitions") || "[]")
        const newReplies = updatedRequisitions.filter(
          (req: any) =>
            req.status === "replied" &&
            !currentRequisitions.find((current: any) => current.id === req.id && current.status === "replied"),
        )

        if (newReplies.length > 0) {
          toast({
            title: "New Reply Received",
            description: `${newReplies.length} reply(ies) received from seller's conveyancer`,
          })
        }
      }

      if (e.key === "buyer-sent-requisitions") {
        const updatedSent = JSON.parse(e.newValue || "[]")
        setSentRequisitions(updatedSent)
      }
    }

    const handlePlatformReset = () => {
      // Clear all local state when the global "Reset Demo" event fires
      setRequisitions([])
      setSentRequisitions([])
      setActiveFilter("all")
      setNewRequisition({
        subject: "",
        customSubject: "",
        priority: "medium",
        urgency: "standard",
        dueDate: "",
        details: "",
        notes: "",
      })
      localStorage.setItem(
        "buyer-conveyancer-form-state",
        JSON.stringify({
          subject: "",
          customSubject: "",
          priority: "medium",
          urgency: "standard",
          dueDate: "",
          details: "",
          notes: "",
        }),
      )
      setUrgentReply("")
      setShowSentProof(null)
      setShowNewRequisitionForm(false)
    }

    const handleFocus = () => {
      // Re-hydrate the latest data when the tab regains focus
      setSentRequisitions(JSON.parse(localStorage.getItem("buyer-sent-requisitions") || "[]"))
      setRequisitions(JSON.parse(localStorage.getItem("buyer-conveyancer-requisitions") || "[]"))
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("platform-reset", handlePlatformReset)

    // Run once on mount
    handleFocus()

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("platform-reset", handlePlatformReset)
    }
  }, [toast])

  // Initialize data - Load from localStorage on mount
  useEffect(() => {
    // Load existing requisitions from localStorage
    const savedRequisitions = localStorage.getItem("buyer-conveyancer-requisitions")
    if (savedRequisitions) {
      try {
        const parsedRequisitions = JSON.parse(savedRequisitions)
        setRequisitions(parsedRequisitions)
      } catch (error) {
        console.error("Error parsing saved requisitions:", error)
        setRequisitions([])
      }
    }

    // Load existing sent requisitions from localStorage
    const savedSentRequisitions = localStorage.getItem("buyer-sent-requisitions")
    if (savedSentRequisitions) {
      try {
        const parsedSentRequisitions = JSON.parse(savedSentRequisitions)
        setSentRequisitions(parsedSentRequisitions)
      } catch (error) {
        console.error("Error parsing saved sent requisitions:", error)
        setSentRequisitions([])
      }
    }

    // Load active filter from localStorage
    const savedFilter = localStorage.getItem("buyer-conveyancer-active-filter")
    if (savedFilter) {
      setActiveFilter(savedFilter)
    }

    // Load form state from localStorage
    const savedFormState = localStorage.getItem("buyer-conveyancer-form-state")
    if (savedFormState) {
      try {
        const parsedFormState = JSON.parse(savedFormState)
        setNewRequisition(parsedFormState)
      } catch (error) {
        console.error("Error parsing saved form state:", error)
      }
    }
  }, [])

  // Calculate statistics
  const stats = {
    total: requisitions.length,
    replied: requisitions.filter((r) => r.status === "replied").length,
    pending: requisitions.filter((r) => r.status === "pending").length,
    urgent: requisitions.filter((r) => r.status === "urgent").length,
    sentByMe: requisitions.filter((r) => r.sentByMe).length,
  }

  const progressPercentage = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  // Filter requisitions based on active filter
  const filteredRequisitions = requisitions.filter((req) => {
    if (activeFilter === "all") return true
    if (activeFilter === "replied") return req.status === "replied"
    if (activeFilter === "pending") return req.status === "pending"
    if (activeFilter === "urgent") return req.status === "urgent"
    return true
  })

  // Handle filter click
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
    localStorage.setItem("buyer-conveyancer-active-filter", filter)
    toast({
      title: "Filter Applied",
      description: `Showing ${filter === "all" ? "all" : filter} requisitions`,
    })
  }

  // Handle refresh
  const handleRefresh = () => {
    // Refresh sent requisitions from localStorage
    const updatedSentRequisitions = JSON.parse(localStorage.getItem("buyer-sent-requisitions") || "[]")
    setSentRequisitions(updatedSentRequisitions)

    // Refresh requisitions from localStorage
    const updatedRequisitions = JSON.parse(localStorage.getItem("buyer-conveyancer-requisitions") || "[]")
    setRequisitions(updatedRequisitions)

    toast({
      title: "Data Refreshed",
      description: "Requisitions data has been updated",
    })
  }

  // Handle export
  const handleExport = () => {
    const csvContent = requisitions
      .map(
        (req) =>
          `"${req.title}","${req.status}","${req.priority}","${req.receivedDate}","${req.dueDate}","${req.repliedDate || ""}"`,
      )
      .join("\n")

    const blob = new Blob([`Title,Status,Priority,Received,Due,Replied\n${csvContent}`], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "requisitions-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Requisitions report downloaded successfully",
    })
  }

  // Handle bulk operations
  const handleBulkReply = () => {
    const pendingReqs = requisitions.filter((r) => r.status === "pending" || r.status === "urgent")
    const updatedRequisitions = requisitions.map((req) =>
      req.status === "pending" || req.status === "urgent"
        ? {
            ...req,
            status: "replied" as const,
            repliedDate: new Date().toISOString().split("T")[0],
            reply: "Standard reply sent",
          }
        : req,
    )

    setRequisitions(updatedRequisitions)
    localStorage.setItem("buyer-conveyancer-requisitions", JSON.stringify(updatedRequisitions))

    toast({
      title: "Bulk Reply Sent",
      description: `${pendingReqs.length} requisitions marked as replied`,
    })
  }

  const handleSetReminders = () => {
    toast({
      title: "Reminders Set",
      description: "Reminders have been set for all pending requisitions",
    })
  }

  const handleMarkAllRead = () => {
    toast({
      title: "All Marked as Read",
      description: "All requisitions have been marked as read",
    })
  }

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Detailed requisitions report has been generated",
    })
  }

  // Handle urgent reply
  const handleUrgentReply = () => {
    if (!urgentReply.trim()) {
      toast({
        title: "Reply Required",
        description: "Please enter a reply before sending",
        variant: "destructive",
      })
      return
    }

    const updatedRequisitions = requisitions.map((req) =>
      req.status === "urgent"
        ? {
            ...req,
            status: "replied" as const,
            repliedDate: new Date().toISOString().split("T")[0],
            reply: urgentReply,
          }
        : req,
    )

    setRequisitions(updatedRequisitions)
    localStorage.setItem("buyer-conveyancer-requisitions", JSON.stringify(updatedRequisitions))
    setUrgentReply("")

    toast({
      title: "Reply Sent",
      description: "Urgent requisition reply has been sent successfully",
    })
  }

  return (
    <TransactionLayout currentStage="replies-to-requisitions" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Header with Continue to Completion Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Replies to Requisitions</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Review and respond to completion requisitions from the seller's conveyancer
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowNewRequisitionForm(!showNewRequisitionForm)}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send New Requisition
            </Button>
            <Button
              onClick={handleContinueToCompletion}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <ArrowRight className="h-4 w-4" />
              Continue to Completion
            </Button>
          </div>
        </div>

        {/* Send New Requisition Form */}
        {showNewRequisitionForm && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    Send New Requisition
                  </CardTitle>
                  <CardDescription>Create and send a new requisition to the seller's conveyancer</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNewRequisitionForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="requisition-subject">
                    Requisition Subject <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="requisition-subject"
                    value={newRequisition.subject}
                    onChange={(e) => {
                      setNewRequisition((prev) => ({ ...prev, subject: e.target.value }))
                      localStorage.setItem(
                        "buyer-conveyancer-form-state",
                        JSON.stringify({ ...newRequisition, subject: e.target.value }),
                      )
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a subject...</option>
                    <optgroup label="Completion & Financial">
                      <option value="final-completion-statement">Final Completion Statement</option>
                      <option value="deposit-confirmation">Deposit Confirmation</option>
                      <option value="mortgage-funds-confirmation">Mortgage Funds Confirmation</option>
                      <option value="completion-arrangements">Completion Arrangements</option>
                      <option value="apportionments">Apportionments & Adjustments</option>
                    </optgroup>
                    <optgroup label="Property & Title">
                      <option value="title-deeds-delivery">Title Deeds Delivery</option>
                      <option value="vacant-possession">Vacant Possession Confirmation</option>
                      <option value="property-boundaries">Property Boundaries</option>
                      <option value="access-rights">Access Rights & Easements</option>
                      <option value="restrictive-covenants">Restrictive Covenants</option>
                    </optgroup>
                    <optgroup label="Documentation">
                      <option value="legal-pack-documents">Legal Pack Documents</option>
                      <option value="property-information-forms">Property Information Forms</option>
                      <option value="planning-permissions">Planning Permissions</option>
                      <option value="building-regulations">Building Regulations Approval</option>
                      <option value="warranties-guarantees">Warranties & Guarantees</option>
                    </optgroup>
                    <optgroup label="Searches & Surveys">
                      <option value="local-authority-searches">Local Authority Searches</option>
                      <option value="environmental-searches">Environmental Searches</option>
                      <option value="water-drainage-searches">Water & Drainage Searches</option>
                      <option value="chancel-repair-liability">Chancel Repair Liability</option>
                    </optgroup>
                    <optgroup label="Services & Utilities">
                      <option value="utilities-transfer">Utilities Transfer</option>
                      <option value="service-charge-information">Service Charge Information</option>
                      <option value="ground-rent-details">Ground Rent Details</option>
                      <option value="management-company-details">Management Company Details</option>
                    </optgroup>
                    <optgroup label="Insurance & Protection">
                      <option value="insurance-policy-details">Insurance Policy Details</option>
                      <option value="outstanding-charges">Outstanding Charges/Mortgages</option>
                      <option value="indemnity-policies">Indemnity Policies</option>
                    </optgroup>
                    <optgroup label="Physical Property">
                      <option value="key-collection">Key Collection Arrangements</option>
                      <option value="fixtures-fittings">Fixtures & Fittings</option>
                      <option value="meter-readings">Meter Readings</option>
                      <option value="property-condition">Property Condition</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="custom">Custom Requisition</option>
                    </optgroup>
                  </select>
                </div>

                {/* Priority Level */}
                <div className="space-y-2">
                  <Label htmlFor="requisition-priority">Priority Level</Label>
                  <select
                    id="requisition-priority"
                    value={newRequisition.priority}
                    onChange={(e) => {
                      const priority = e.target.value as "high" | "medium" | "low"
                      setNewRequisition((prev) => ({ ...prev, priority: priority }))
                      localStorage.setItem(
                        "buyer-conveyancer-form-state",
                        JSON.stringify({ ...newRequisition, priority: priority }),
                      )
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Custom Subject Input */}
              {newRequisition.subject === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-subject">
                    Custom Subject <span className="text-red-500">*</span>
                  </Label>
                  <input
                    type="text"
                    id="custom-subject"
                    value={newRequisition.customSubject}
                    onChange={(e) => {
                      setNewRequisition((prev) => ({ ...prev, customSubject: e.target.value }))
                      localStorage.setItem(
                        "buyer-conveyancer-form-state",
                        JSON.stringify({ ...newRequisition, customSubject: e.target.value }),
                      )
                    }}
                    placeholder="Enter custom requisition subject..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              {/* Due Date and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requisition-due-date">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <input
                    type="date"
                    id="requisition-due-date"
                    value={newRequisition.dueDate}
                    onChange={(e) => {
                      setNewRequisition((prev) => ({ ...prev, dueDate: e.target.value }))
                      localStorage.setItem(
                        "buyer-conveyancer-form-state",
                        JSON.stringify({ ...newRequisition, dueDate: e.target.value }),
                      )
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requisition-urgency">Urgency</Label>
                  <select
                    id="requisition-urgency"
                    value={newRequisition.urgency}
                    onChange={(e) => {
                      setNewRequisition((prev) => ({ ...prev, urgency: e.target.value }))
                      localStorage.setItem(
                        "buyer-conveyancer-form-state",
                        JSON.stringify({ ...newRequisition, urgency: e.target.value }),
                      )
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="urgent">Urgent</option>
                    <option value="asap">ASAP</option>
                  </select>
                </div>
              </div>

              {/* Requisition Details */}
              <div className="space-y-2">
                <Label htmlFor="requisition-details">
                  Requisition Details <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="requisition-details"
                  value={newRequisition.details}
                  onChange={(e) => {
                    setNewRequisition((prev) => ({ ...prev, details: e.target.value }))
                    localStorage.setItem(
                      "buyer-conveyancer-form-state",
                      JSON.stringify({ ...newRequisition, details: e.target.value }),
                    )
                  }}
                  placeholder="Enter detailed description of what you're requesting from the seller's conveyancer..."
                  rows={4}
                  className="w-full"
                  required
                />
                <div className="text-xs text-gray-500">
                  Characters: {newRequisition.details.length} | Be specific and clear about your requirements
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="requisition-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="requisition-notes"
                  value={newRequisition.notes}
                  onChange={(e) => {
                    setNewRequisition((prev) => ({ ...prev, notes: e.target.value }))
                    localStorage.setItem(
                      "buyer-conveyancer-form-state",
                      JSON.stringify({ ...newRequisition, notes: e.target.value }),
                    )
                  }}
                  placeholder="Any additional context or special instructions..."
                  rows={2}
                  className="w-full"
                />
              </div>

              {/* Form Validation Summary */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Form Status:</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {newRequisition.subject ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={newRequisition.subject ? "text-green-700" : "text-gray-500"}>
                      Subject selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {newRequisition.details.trim() ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={newRequisition.details.trim() ? "text-green-700" : "text-gray-500"}>
                      Details provided
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {newRequisition.dueDate ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={newRequisition.dueDate ? "text-green-700" : "text-gray-500"}>Due date set</span>
                  </div>
                  {newRequisition.subject === "custom" && (
                    <div className="flex items-center gap-2">
                      {newRequisition.customSubject.trim() ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={newRequisition.customSubject.trim() ? "text-green-700" : "text-gray-500"}>
                        Custom subject provided
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSendRequisition}
                  disabled={
                    !newRequisition.subject ||
                    !newRequisition.details.trim() ||
                    !newRequisition.dueDate ||
                    (newRequisition.subject === "custom" && !newRequisition.customSubject.trim())
                  }
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Requisition
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  disabled={!newRequisition.subject || !newRequisition.details.trim()}
                >
                  Save as Draft
                </Button>
                <Button variant="outline" onClick={handleClearForm}>
                  Clear Form
                </Button>
              </div>

              {/* Quick Templates */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium mb-2 block">Quick Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    {
                      subject: "final-completion-statement",
                      title: "Completion Statement",
                      template:
                        "Please provide the final completion statement showing all financial adjustments and the exact amount required for completion.",
                    },
                    {
                      subject: "title-deeds-delivery",
                      title: "Title Deeds",
                      template:
                        "Please confirm arrangements for delivery of the title deeds and any other relevant documents on completion.",
                    },
                    {
                      subject: "vacant-possession",
                      title: "Vacant Possession",
                      template:
                        "Please confirm that vacant possession will be given on completion and provide details of key collection arrangements.",
                    },
                    {
                      subject: "insurance-policy-details",
                      title: "Insurance Policy",
                      template:
                        "Please provide a copy of the buildings insurance policy that will be in effect from the completion date.",
                    },
                    {
                      subject: "utilities-transfer",
                      title: "Utilities Transfer",
                      template:
                        "Please provide final meter readings and contact details for all utility companies for transfer arrangements.",
                    },
                    {
                      subject: "outstanding-charges",
                      title: "Outstanding Charges",
                      template:
                        "Please confirm that all outstanding charges, mortgages, and encumbrances will be discharged on completion.",
                    },
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 text-left justify-start bg-transparent"
                      onClick={() => handleUseTemplate(template)}
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Requisitions Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Requisitions Overview
                </CardTitle>
                <CardDescription>Interactive status dashboard for completion requisitions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{progressPercentage}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.replied} of {stats.total} requisitions replied
              </div>
            </div>

            {/* Interactive Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Requisitions",
                  value: stats.total,
                  color: "blue",
                  filter: "all",
                  icon: FileText,
                  description: "All received requisitions",
                },
                {
                  label: "Replied",
                  value: stats.replied,
                  color: "green",
                  filter: "replied",
                  icon: CheckCircle,
                  description: "Successfully replied",
                },
                {
                  label: "Pending",
                  value: stats.pending,
                  color: "yellow",
                  filter: "pending",
                  icon: Clock,
                  description: "Awaiting response",
                },
                {
                  label: "Urgent",
                  value: stats.urgent,
                  color: "red",
                  filter: "urgent",
                  icon: AlertTriangle,
                  description: "Requires immediate attention",
                },
              ].map((stat) => (
                <div
                  key={stat.filter}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
                    activeFilter === stat.filter
                      ? `border-${stat.color}-500 bg-${stat.color}-50`
                      : "border-transparent hover:border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => handleFilterClick(stat.filter)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon
                      className={`h-5 w-5 ${activeFilter === stat.filter ? `text-${stat.color}-600` : "text-gray-500"}`}
                    />
                    {stat.value > 0 && stat.filter !== "all" && (
                      <Badge
                        variant={
                          stat.color === "red" ? "destructive" : stat.color === "green" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {stat.value}
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      activeFilter === stat.filter ? `text-${stat.color}-700` : "text-gray-700"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Active Filter Indicator */}
            {activeFilter !== "all" && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Badge variant="secondary" className="capitalize">
                  Active Filter: {activeFilter} ({filteredRequisitions.length} items)
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => handleFilterClick("all")}>
                  <X className="h-3 w-3 mr-1" />
                  Clear Filter
                </Button>
              </div>
            )}

            {/* Real-time Status */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real-time updates active</span>
              </div>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* All Requisitions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  All Requisitions
                  {activeFilter !== "all" && (
                    <Badge variant="secondary" className="ml-2 capitalize">
                      {activeFilter} ({filteredRequisitions.length})
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {activeFilter === "all"
                    ? "Complete list of all completion requisitions"
                    : `Filtered view showing ${activeFilter} requisitions`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkReply}>
                  <Send className="h-4 w-4 mr-2" />
                  Bulk Reply
                </Button>
                <Button variant="outline" size="sm" onClick={handleSetReminders}>
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminders
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRequisitions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeFilter === "all" ? "No Requisitions Yet" : `No ${activeFilter} Requisitions`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeFilter === "all"
                    ? "Requisitions from the seller's conveyancer will appear here"
                    : `No requisitions match the ${activeFilter} filter`}
                </p>
                {activeFilter !== "all" && (
                  <Button variant="outline" onClick={() => handleFilterClick("all")}>
                    View All Requisitions
                  </Button>
                )}
              </div>
            ) : (
              filteredRequisitions.map((requisition) => (
                <Card
                  key={requisition.id}
                  className={`border-l-4 transition-all duration-200 hover:shadow-md ${
                    requisition.status === "replied"
                      ? "border-l-green-500 bg-green-50/30"
                      : requisition.status === "urgent"
                        ? "border-l-red-500 bg-red-50/30"
                        : "border-l-yellow-500 bg-yellow-50/30"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base">{requisition.title}</CardTitle>
                        {requisition.sentByMe && (
                          <Badge variant="outline" className="text-xs">
                            Sent by Me
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            requisition.priority === "high"
                              ? "destructive"
                              : requisition.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {requisition.priority} priority
                        </Badge>
                        <Badge
                          variant={
                            requisition.status === "replied"
                              ? "default"
                              : requisition.status === "urgent"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {requisition.status === "replied" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Replied
                            </>
                          ) : requisition.status === "urgent" ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Urgent
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span>Received: {new Date(requisition.receivedDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(requisition.dueDate).toLocaleDateString()}</span>
                      {requisition.repliedDate && (
                        <span>Replied: {new Date(requisition.repliedDate).toLocaleDateString()}</span>
                      )}
                      {requisition.referenceNumber && (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">Ref: {requisition.referenceNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => copyReferenceNumber(requisition.referenceNumber!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{requisition.description}</p>
                    </div>

                    {requisition.reply && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Reply Received</span>
                        </div>
                        <p className="text-sm text-green-700">{requisition.reply}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {requisition.status !== "replied" && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {requisition.status === "replied"
                          ? "✓ Complete"
                          : `${Math.ceil((new Date(requisition.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Sent Requisitions Section */}
        {sentRequisitions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Sent Requisitions
                    <Badge variant="secondary" className="ml-2">
                      {sentRequisitions.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Requisitions you have sent to the seller's conveyancer</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                    <Eye className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerateReport}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sentRequisitions.slice(-5).map((sentReq) => (
                <Card
                  key={sentReq.id}
                  className={`border-l-4 ${
                    sentReq.status === "replied"
                      ? "border-l-green-500 bg-green-50/30"
                      : sentReq.status === "acknowledged"
                        ? "border-l-blue-500 bg-blue-50/30"
                        : "border-l-gray-500 bg-gray-50/30"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{sentReq.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            sentReq.priority === "high"
                              ? "destructive"
                              : sentReq.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {sentReq.priority}
                        </Badge>
                        <Badge
                          variant={
                            sentReq.status === "replied"
                              ? "default"
                              : sentReq.status === "acknowledged"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {sentReq.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span>Sent: {new Date(sentReq.sentDate).toLocaleDateString()}</span>
                      <span>Time: {sentReq.sentTime}</span>
                      <span>Due: {new Date(sentReq.dueDate).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">Ref: {sentReq.referenceNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => copyReferenceNumber(sentReq.referenceNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{sentReq.description}</p>
                    </div>

                    {sentReq.recipientConfirmation && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Delivery Confirmation</span>
                        </div>
                        <p className="text-sm text-blue-700">{sentReq.recipientConfirmation}</p>
                      </div>
                    )}

                    {sentReq.reply && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Reply Received</span>
                          {sentReq.repliedDate && (
                            <span className="text-xs text-green-600">
                              on {new Date(sentReq.repliedDate).toLocaleDateString()}
                              {sentReq.repliedTime && ` at ${sentReq.repliedTime}`}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-green-700">{sentReq.reply}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowSentProof(sentReq)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Proof
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Track Status
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sentReq.status === "replied"
                          ? "✓ Reply received"
                          : sentReq.status === "acknowledged"
                            ? "📨 Acknowledged"
                            : "📤 Sent"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Urgent Requisitions Alert */}
        {stats.urgent > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Urgent Requisitions Require Immediate Attention
              </CardTitle>
              <CardDescription className="text-red-700">
                {stats.urgent} requisition{stats.urgent > 1 ? "s" : ""} marked as urgent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="urgent-reply">Quick Reply to All Urgent Requisitions</Label>
                <Textarea
                  id="urgent-reply"
                  placeholder="Enter your reply to all urgent requisitions..."
                  value={urgentReply}
                  onChange={(e) => setUrgentReply(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUrgentReply} className="bg-red-600 hover:bg-red-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Urgent Reply
                </Button>
                <Button variant="outline" onClick={() => handleFilterClick("urgent")}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Urgent Items
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common actions for managing requisitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="w-full h-auto p-4 text-left bg-transparent"
                onClick={() => setShowNewRequisitionForm(true)}
              >
                <div>
                  <div className="font-medium">Send New Requisition</div>
                  <div className="text-sm text-gray-600">Create and send a new requisition</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 text-left bg-transparent" onClick={handleBulkReply}>
                <div>
                  <div className="font-medium">Bulk Reply</div>
                  <div className="text-sm text-gray-600">Reply to multiple requisitions at once</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 text-left bg-transparent" onClick={handleGenerateReport}>
                <div>
                  <div className="font-medium">Generate Report</div>
                  <div className="text-sm text-gray-600">Create a detailed status report</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Proof of Sending Modal */}
        {showSentProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Proof of Sending
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowSentProof(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Delivery confirmation and tracking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Reference Number:</span>
                    <div className="font-mono text-blue-600">{showSentProof.referenceNumber}</div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge variant="default" className="ml-2">
                      {showSentProof.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Sent Date:</span>
                    <div>{new Date(showSentProof.sentDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Sent Time:</span>
                    <div>{showSentProof.sentTime}</div>
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>
                    <Badge
                      variant={
                        showSentProof.priority === "high"
                          ? "destructive"
                          : showSentProof.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="ml-2"
                    >
                      {showSentProof.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span>
                    <div>{new Date(showSentProof.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-sm">Subject:</span>
                  <p className="text-sm mt-1">{showSentProof.title}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-sm">Message:</span>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{showSentProof.description}</p>
                </div>

                {showSentProof.recipientConfirmation && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="font-medium text-sm text-green-800">Delivery Confirmation:</span>
                    <p className="text-sm text-green-700 mt-1">{showSentProof.recipientConfirmation}</p>
                  </div>
                )}

                {showSentProof.reply && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-medium text-sm text-blue-800">Reply Received:</span>
                    <p className="text-sm text-blue-700 mt-1">{showSentProof.reply}</p>
                    {showSentProof.repliedDate && (
                      <p className="text-xs text-blue-600 mt-2">
                        Replied on {new Date(showSentProof.repliedDate).toLocaleDateString()}
                        {showSentProof.repliedTime && ` at ${showSentProof.repliedTime}`}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => copyReferenceNumber(showSentProof.referenceNumber)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Reference
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => setShowSentProof(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button
            onClick={handleContinueToCompletion}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ArrowRight className="h-4 w-4" />
            Continue to Completion
          </Button>
          <Button variant="outline" asChild>
            <Link href="/buyer-conveyancer/transaction">Back to Transaction Overview</Link>
          </Button>
          <Button variant="outline" onClick={() => setShowNewRequisitionForm(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Another Requisition
          </Button>
        </div>
      </div>
    </TransactionLayout>
  )
}
