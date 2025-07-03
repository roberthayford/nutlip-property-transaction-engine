"use client"

import { useState, useEffect, useRef } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRealTime } from "@/contexts/real-time-context"
import {
  FileText,
  AlertTriangle,
  Clock,
  Download,
  CheckCircle,
  Eye,
  MessageSquare,
  Calendar,
  User,
  FileCheck,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Send,
  Reply,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Bell,
  Sparkles,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function BuyerConveyancerDraftContractPage() {
  const [amendments, setAmendments] = useState("")
  const [downloadingDocuments, setDownloadingDocuments] = useState<Set<string>>(new Set())
  const [downloadedDocuments, setDownloadedDocuments] = useState<Set<string>>(new Set())
  const [reviewStatus, setReviewStatus] = useState<"not-started" | "in-progress" | "completed">("not-started")
  const [continuingToNext, setContinuingToNext] = useState(false)
  const [refreshingReplies, setRefreshingReplies] = useState(false)

  // keeps track of docs we've already shown a notification for
  const notifiedDocs = useRef<Set<string>>(new Set())
  // keeps track of amendment replies we've already shown a notification for
  const notifiedReplies = useRef<Set<string>>(new Set())

  const [showAmendmentModal, setShowAmendmentModal] = useState(false)
  const [amendmentRequest, setAmendmentRequest] = useState({
    type: "",
    priority: "medium" as "low" | "medium" | "high",
    description: "",
    proposedChange: "",
    deadline: "",
    affectedClauses: [] as string[],
  })
  const [sendingRequest, setSendingRequest] = useState(false)

  const {
    getDocumentsForRole,
    downloadDocument,
    markDocumentAsReviewed,
    sendUpdate,
    addAmendmentRequest,
    amendmentRequests,
  } = useRealTime()

  const [contractIssues, setContractIssues] = useState<ContractIssue[]>([])
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [editingIssue, setEditingIssue] = useState<ContractIssue | null>(null)
  const [issueForm, setIssueForm] = useState({
    title: "",
    category: "",
    severity: "minor" as "critical" | "major" | "minor",
    contractSection: "",
    description: "",
    proposedSolution: "",
    legalImplications: "",
    status: "open" as "open" | "in-progress" | "resolved",
  })
  const [savingIssue, setSavingIssue] = useState(false)

  // Get documents sent to buyer conveyancer for draft-contract stage
  const receivedDocuments = getDocumentsForRole("buyer-conveyancer", "draft-contract")

  // Get amendment requests sent BY buyer conveyancer (to track replies)
  const sentAmendmentRequests = amendmentRequests.filter(
    (req) => req.requestedBy === "buyer-conveyancer" && req.stage === "draft-contract",
  )

  // Check if there are new documents and show notifications
  useEffect(() => {
    const newDelivered = receivedDocuments.filter(
      (doc) => doc.status === "delivered" && !notifiedDocs.current.has(doc.id),
    )

    if (newDelivered.length) {
      newDelivered.forEach((doc) => {
        // Show toast notification for new document
        toast({
          title: "📄 New Contract Received",
          description: `${doc.name} is ready for review from seller's conveyancer`,
          duration: 8000,
        })

        // Send activity update
        sendUpdate({
          type: "document_uploaded",
          stage: "draft-contract",
          role: "buyer-conveyancer",
          title: "New Contract Received",
          description: `${doc.name} is ready for review`,
          data: { documentId: doc.id },
        })

        notifiedDocs.current.add(doc.id)
      })
    }
  }, [receivedDocuments, sendUpdate])

  // Check for new amendment replies and show notifications
  useEffect(() => {
    const newReplies = sentAmendmentRequests.filter((req) => req.reply && !notifiedReplies.current.has(req.id))

    if (newReplies.length) {
      newReplies.forEach((req) => {
        if (req.reply) {
          // Show prominent toast notification for reply
          const isAccepted = req.reply.decision === "accepted"
          const isRejected = req.reply.decision === "rejected"
          const isCounterProposal = req.reply.decision === "counter-proposal"

          toast({
            title: `🎉 Amendment Reply Received!`,
            description: `${req.type} amendment request: ${req.reply.decision.toUpperCase().replace("-", " ")}`,
            duration: 10000,
            variant: isRejected ? "destructive" : "default",
          })

          // Send real-time update
          sendUpdate({
            type: "amendment_replied",
            stage: "draft-contract",
            role: "seller-conveyancer",
            title: "Amendment Reply Received",
            description: `${req.reply.decision.toUpperCase().replace("-", " ")}: ${req.type} amendment request`,
            data: {
              amendmentId: req.id,
              decision: req.reply.decision,
              replyMessage: req.reply.message,
            },
          })

          notifiedReplies.current.add(req.id)
        }
      })
    }
  }, [sentAmendmentRequests, sendUpdate, toast])

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Platform reset detected, clearing draft contract data")

      // Reset all state
      setDownloadedDocuments(new Set())
      setDownloadingDocuments(new Set())
      setReviewStatus("not-started")
      setAmendments("")
      setAmendmentRequest({
        type: "",
        priority: "medium",
        description: "",
        proposedChange: "",
        deadline: "",
        affectedClauses: [],
      })
      setShowAmendmentModal(false)
      setContinuingToNext(false)
      notifiedDocs.current.clear()
      notifiedReplies.current.clear()

      setContractIssues([])
      setShowIssueModal(false)
      setEditingIssue(null)
      setIssueForm({
        title: "",
        category: "",
        severity: "minor",
        contractSection: "",
        description: "",
        proposedSolution: "",
        legalImplications: "",
        status: "open",
      })
      setSavingIssue(false)

      toast({
        title: "Draft Contract Reset",
        description: "All draft contract data has been cleared and reset to default state.",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [])

  const handleDownloadDocument = async (documentId: string, documentName: string) => {
    setDownloadingDocuments((prev) => new Set([...prev, documentId]))

    try {
      const blob = await downloadDocument(documentId, "buyer-conveyancer")
      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = documentName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Mark as downloaded
        setDownloadedDocuments((prev) => new Set([...prev, documentId]))

        // Update review status if this is the first download
        if (reviewStatus === "not-started") {
          setReviewStatus("in-progress")
        }

        toast({
          title: "Document Downloaded",
          description: `${documentName} has been downloaded successfully`,
        })
      }
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        title: "Download Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setDownloadingDocuments((prev) => {
        const newSet = new Set(prev)
        newSet.delete(documentId)
        return newSet
      })
    }
  }

  const handleMarkAsReviewed = (documentId: string) => {
    markDocumentAsReviewed(documentId)
    setReviewStatus("completed")

    sendUpdate({
      type: "status_changed",
      stage: "draft-contract",
      role: "buyer-conveyancer",
      title: "Contract Review Completed",
      description: "Draft contract review has been completed",
    })

    toast({
      title: "Review Completed",
      description: "Document has been marked as reviewed",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "downloaded":
        return "bg-green-100 text-green-800"
      case "reviewed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <FileText className="h-4 w-4" />
      case "downloaded":
        return <Download className="h-4 w-4" />
      case "reviewed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleSendAmendmentRequest = async () => {
    if (!amendmentRequest.type || !amendmentRequest.description) {
      toast({
        title: "Incomplete Request",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSendingRequest(true)

    try {
      // Simulate sending amendment request
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add amendment request using the real-time context
      addAmendmentRequest({
        stage: "draft-contract",
        requestedBy: "buyer-conveyancer",
        requestedTo: "seller-conveyancer",
        type: amendmentRequest.type,
        priority: amendmentRequest.priority,
        description: amendmentRequest.description,
        proposedChange: amendmentRequest.proposedChange,
        deadline: amendmentRequest.deadline,
        affectedClauses: amendmentRequest.affectedClauses,
      })

      // Reset form and close modal
      setAmendmentRequest({
        type: "",
        priority: "medium",
        description: "",
        proposedChange: "",
        deadline: "",
        affectedClauses: [],
      })
      setShowAmendmentModal(false)

      toast({
        title: "✅ Amendment Request Sent",
        description:
          "Your amendment request has been sent to the seller's conveyancer and they will be notified immediately",
        duration: 6000,
      })
    } catch (error) {
      toast({
        title: "Failed to Send Request",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSendingRequest(false)
    }
  }

  const handleContinueToNextStage = async () => {
    setContinuingToNext(true)

    try {
      // Send stage completion update
      sendUpdate({
        type: "stage_completed",
        stage: "draft-contract",
        role: "buyer-conveyancer",
        title: "Draft Contract Stage Completed",
        description: "Draft contract review has been completed and approved",
        data: {
          draftContract: {
            status: "completed",
            completedBy: "Buyer Conveyancer",
            completedAt: new Date().toISOString(),
            contractType: "Standard Residential Purchase",
            reviewedDocuments: receivedDocuments.length,
            amendmentsRequested: sentAmendmentRequests.length,
            nextStage: "Property Searches & Survey",
          },
        },
      })

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Stage Completed",
        description: "Moving to Property Searches & Survey stage",
      })

      // Navigate to next stage
      window.location.href = "/buyer-conveyancer/search-survey"
    } catch (error) {
      toast({
        title: "Navigation Failed",
        description: "Please try again",
        variant: "destructive",
      })
      setContinuingToNext(false)
    }
  }

  interface ContractIssue {
    id: string
    title: string
    category: string
    severity: "critical" | "major" | "minor"
    contractSection: string
    description: string
    proposedSolution?: string
    legalImplications?: string
    status: "open" | "in-progress" | "resolved"
    identifiedAt: Date
    resolvedAt?: Date
  }

  const handleAddIssue = async () => {
    if (!issueForm.title || !issueForm.category || !issueForm.description) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSavingIssue(true)

    try {
      const newIssue: ContractIssue = {
        id: `issue-${Date.now()}`,
        ...issueForm,
        identifiedAt: new Date(),
      }

      setContractIssues((prev) => [...prev, newIssue])

      // Send update to real-time system
      sendUpdate({
        type: "document_uploaded",
        stage: "draft-contract",
        role: "buyer-conveyancer",
        title: "Contract Issue Identified",
        description: `${issueForm.severity.toUpperCase()} issue identified: ${issueForm.title}`,
        data: {
          issueId: newIssue.id,
          severity: issueForm.severity,
          category: issueForm.category,
        },
      })

      // Reset form and close modal
      setIssueForm({
        title: "",
        category: "",
        severity: "minor",
        contractSection: "",
        description: "",
        proposedSolution: "",
        legalImplications: "",
        status: "open",
      })
      setShowIssueModal(false)
      setEditingIssue(null)

      toast({
        title: "Issue Added",
        description: "Contract issue has been documented successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to Add Issue",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSavingIssue(false)
    }
  }

  const handleEditIssue = (issue: ContractIssue) => {
    setEditingIssue(issue)
    setIssueForm({
      title: issue.title,
      category: issue.category,
      severity: issue.severity,
      contractSection: issue.contractSection,
      description: issue.description,
      proposedSolution: issue.proposedSolution || "",
      legalImplications: issue.legalImplications || "",
      status: issue.status,
    })
    setShowIssueModal(true)
  }

  const handleUpdateIssue = async () => {
    if (!editingIssue) return

    setSavingIssue(true)

    try {
      setContractIssues((prev) =>
        prev.map((issue) =>
          issue.id === editingIssue.id
            ? {
                ...issue,
                ...issueForm,
              }
            : issue,
        ),
      )

      sendUpdate({
        type: "status_changed",
        stage: "draft-contract",
        role: "buyer-conveyancer",
        title: "Contract Issue Updated",
        description: `Issue "${issueForm.title}" has been updated`,
      })

      // Reset form and close modal
      setIssueForm({
        title: "",
        category: "",
        severity: "minor",
        contractSection: "",
        description: "",
        proposedSolution: "",
        legalImplications: "",
        status: "open",
      })
      setShowIssueModal(false)
      setEditingIssue(null)

      toast({
        title: "Issue Updated",
        description: "Contract issue has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to Update Issue",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSavingIssue(false)
    }
  }

  const handleResolveIssue = (issueId: string) => {
    setContractIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: "resolved" as const,
              resolvedAt: new Date(),
            }
          : issue,
      ),
    )

    const issue = contractIssues.find((i) => i.id === issueId)
    if (issue) {
      sendUpdate({
        type: "status_changed",
        stage: "draft-contract",
        role: "buyer-conveyancer",
        title: "Contract Issue Resolved",
        description: `Issue "${issue.title}" has been marked as resolved`,
      })

      toast({
        title: "Issue Resolved",
        description: "Contract issue has been marked as resolved",
      })
    }
  }

  const handleCreateAmendmentFromIssue = (issue: ContractIssue) => {
    // Pre-populate amendment request form with issue details
    setAmendmentRequest({
      type: issue.category,
      priority: issue.severity === "critical" ? "high" : issue.severity === "major" ? "medium" : "low",
      description: issue.description,
      proposedChange: issue.proposedSolution || "",
      deadline: "",
      affectedClauses: [issue.contractSection],
    })
    setShowAmendmentModal(true)
  }

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getReplyStatusColor = (decision: "accepted" | "rejected" | "counter-proposal") => {
    switch (decision) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      case "counter-proposal":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getReplyStatusIcon = (decision: "accepted" | "rejected" | "counter-proposal") => {
    switch (decision) {
      case "accepted":
        return <CheckCircle2 className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "counter-proposal":
        return <AlertOctagon className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleRefreshReplies = async () => {
    setRefreshingReplies(true)

    // Force a re-check of the real-time context
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"))
      setRefreshingReplies(false)

      toast({
        title: "Refreshed",
        description: "Checked for new amendment replies",
      })
    }, 1000)
  }

  return (
    <TransactionLayout currentStage="draft-contract" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Amendment Request Status Section */}
        {sentAmendmentRequests.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Send className="h-5 w-5" />
                    Amendment Request Status
                    <Badge variant="secondary" className="ml-2">
                      {sentAmendmentRequests.length} request{sentAmendmentRequests.length !== 1 ? "s" : ""}
                    </Badge>
                    {sentAmendmentRequests.some((req) => req.reply && !notifiedReplies.current.has(req.id)) && (
                      <Badge className="bg-green-100 text-green-800 animate-pulse">
                        <Bell className="h-3 w-3 mr-1" />
                        <Sparkles className="h-3 w-3 mr-1" />
                        New Reply!
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Track the status of your amendment requests to the seller's conveyancer
                  </CardDescription>
                </div>
                <Button onClick={handleRefreshReplies} disabled={refreshingReplies} variant="outline" size="sm">
                  {refreshingReplies ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sentAmendmentRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                    request.reply && !notifiedReplies.current.has(request.id)
                      ? "ring-2 ring-green-200 bg-gradient-to-r from-green-50/80 to-blue-50/80 shadow-lg"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{request.type}</h4>
                        <Badge className={getPriorityColor(request.priority)}>{request.priority} priority</Badge>
                        <Badge
                          className={
                            request.status === "replied"
                              ? "bg-green-100 text-green-800"
                              : request.status === "acknowledged"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }
                        >
                          {request.status}
                        </Badge>
                        {request.reply && (
                          <Badge className={getReplyStatusColor(request.reply.decision)}>
                            <div className="flex items-center gap-1">
                              {getReplyStatusIcon(request.reply.decision)}
                              {request.reply.decision.replace("-", " ")}
                            </div>
                          </Badge>
                        )}
                        {request.reply && !notifiedReplies.current.has(request.id) && (
                          <Badge className="bg-green-100 text-green-800 animate-pulse">
                            <Bell className="h-3 w-3 mr-1" />
                            <Sparkles className="h-3 w-3 mr-1" />
                            NEW REPLY!
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: {request.createdAt.toLocaleDateString()} at {request.createdAt.toLocaleTimeString()}
                        </div>
                        {request.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Deadline: {new Date(request.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Your Request:</p>
                          <p className="text-sm text-gray-700">{request.description}</p>
                        </div>

                        {request.proposedChange && (
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Proposed Solution:</p>
                            <p className="text-sm text-gray-700">{request.proposedChange}</p>
                          </div>
                        )}

                        {request.affectedClauses.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Affected Clauses:</p>
                            <div className="flex flex-wrap gap-1">
                              {request.affectedClauses.map((clause, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {clause}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reply Section */}
                        {request.reply && (
                          <div
                            className={`border rounded-lg p-4 transition-all duration-300 ${
                              request.reply.decision === "accepted"
                                ? "bg-green-50 border-green-200 shadow-sm"
                                : request.reply.decision === "rejected"
                                  ? "bg-red-50 border-red-200 shadow-sm"
                                  : "bg-blue-50 border-blue-200 shadow-sm"
                            } ${
                              !notifiedReplies.current.has(request.id) ? "ring-2 ring-opacity-50 animate-pulse" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Reply className="h-4 w-4 text-gray-600 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm font-medium text-gray-900">Seller's Conveyancer Reply:</p>
                                  <Badge className={getReplyStatusColor(request.reply.decision)}>
                                    <div className="flex items-center gap-1">
                                      {getReplyStatusIcon(request.reply.decision)}
                                      {request.reply.decision.replace("-", " ").toUpperCase()}
                                    </div>
                                  </Badge>
                                  {!notifiedReplies.current.has(request.id) && (
                                    <Badge className="bg-green-100 text-green-800 animate-bounce">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      JUST RECEIVED
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{request.reply.message}</p>
                                {request.reply.counterProposal && (
                                  <div className="mt-2 p-3 bg-white rounded border border-blue-200">
                                    <p className="text-sm font-medium text-gray-900 mb-1">Counter-proposal:</p>
                                    <p className="text-sm text-gray-700">{request.reply.counterProposal}</p>
                                  </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  Replied on {request.reply.repliedAt.toLocaleDateString()} at{" "}
                                  {request.reply.repliedAt.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Status Messages */}
                        {!request.reply && (
                          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                            <Clock className="h-4 w-4" />
                            <span>Awaiting response from seller's conveyancer...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contract Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Draft Contract Documents
              {receivedDocuments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {receivedDocuments.length} document{receivedDocuments.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Review and download contract documents from the seller's conveyancer</CardDescription>
          </CardHeader>
          <CardContent>
            {receivedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No contract documents received yet</p>
                <p className="text-sm text-gray-500">
                  Documents will appear here when sent by the seller's conveyancer
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedDocuments.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <Badge className={getStatusColor(doc.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(doc.status)}
                              {doc.status}
                            </div>
                          </Badge>
                          {doc.priority && doc.priority !== "standard" && (
                            <Badge
                              className={
                                doc.priority === "urgent" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {doc.priority}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            From: {doc.uploadedBy.replace("-", " ")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Received: {doc.uploadedAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileCheck className="h-3 w-3" />
                            Size: {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>

                        {doc.coverMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">Cover Message:</p>
                            <p className="text-sm text-blue-800">{doc.coverMessage}</p>
                          </div>
                        )}

                        {doc.deadline && (
                          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Response deadline: {new Date(doc.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {doc.status === "delivered" && (
                          <Button
                            onClick={() => handleDownloadDocument(doc.id, doc.name)}
                            disabled={downloadingDocuments.has(doc.id)}
                            size="sm"
                            className="w-32"
                          >
                            {downloadingDocuments.has(doc.id) ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                        )}

                        {downloadedDocuments.has(doc.id) && doc.status !== "reviewed" && (
                          <Button
                            onClick={() => handleMarkAsReviewed(doc.id)}
                            variant="outline"
                            size="sm"
                            className="w-32"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Mark Reviewed
                          </Button>
                        )}

                        {doc.status === "reviewed" && (
                          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded w-32 justify-center">
                            <CheckCircle className="h-4 w-4" />
                            <span>Reviewed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Issues Tracker */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Contract Issues
                  {contractIssues.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {contractIssues.length} issue{contractIssues.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Identify and track issues found during contract review</CardDescription>
              </div>
              <Button onClick={() => setShowIssueModal(true)} size="sm">
                Add Issue
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contractIssues.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No issues identified</p>
                <p className="text-sm text-gray-500">Issues will be tracked here as you review the contract</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contractIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                          <Badge
                            className={
                              issue.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : issue.severity === "major"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {issue.severity}
                          </Badge>
                          <Badge
                            className={
                              issue.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : issue.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {issue.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>Category: {issue.category}</div>
                          <div>Section: {issue.contractSection}</div>
                          <div>Identified: {issue.identifiedAt.toLocaleDateString()}</div>
                          {issue.resolvedAt && <div>Resolved: {issue.resolvedAt.toLocaleDateString()}</div>}
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Description:</p>
                            <p className="text-sm text-gray-700">{issue.description}</p>
                          </div>

                          {issue.proposedSolution && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Proposed Solution:</p>
                              <p className="text-sm text-gray-700">{issue.proposedSolution}</p>
                            </div>
                          )}

                          {issue.legalImplications && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Legal Implications:</p>
                              <p className="text-sm text-gray-700">{issue.legalImplications}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button onClick={() => handleEditIssue(issue)} variant="outline" size="sm">
                          Edit
                        </Button>
                        {issue.status !== "resolved" && (
                          <Button onClick={() => handleResolveIssue(issue.id)} variant="outline" size="sm">
                            Resolve
                          </Button>
                        )}
                        {issue.proposedSolution && (
                          <Button onClick={() => handleCreateAmendmentFromIssue(issue)} size="sm">
                            Create Amendment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amendment Request Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Request Contract Amendments
                </CardTitle>
                <CardDescription>Send amendment requests to the seller's conveyancer</CardDescription>
              </div>
              <Button onClick={() => setShowAmendmentModal(true)} size="sm">
                New Amendment Request
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">
                Click "New Amendment Request" to request changes to the draft contract
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Review Status and Actions */}
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Review Status & Next Steps
            </CardTitle>
            <CardDescription>Complete your review and proceed to the next stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{receivedDocuments.length}</div>
                <div className="text-sm text-gray-600">Documents Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{downloadedDocuments.size}</div>
                <div className="text-sm text-gray-600">Documents Downloaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {receivedDocuments.filter((doc) => doc.status === "reviewed").length}
                </div>
                <div className="text-sm text-gray-600">Documents Reviewed</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={handleContinueToNextStage}
                disabled={
                  continuingToNext ||
                  receivedDocuments.length === 0 ||
                  receivedDocuments.some((doc) => doc.status !== "reviewed")
                }
                className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                size="lg"
              >
                {continuingToNext ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Property Searches & Survey
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              {receivedDocuments.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>Waiting for contract documents from seller's conveyancer</span>
                </div>
              )}

              {receivedDocuments.length > 0 && receivedDocuments.some((doc) => doc.status !== "reviewed") && (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please review all documents before proceeding to the next stage</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Amendment Request Modal */}
        {showAmendmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Request Contract Amendment
                    </CardTitle>
                    <CardDescription>Submit a request for changes to the draft contract</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAmendmentModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amendment-type" className="text-sm font-medium">
                      Amendment Type *
                    </Label>
                    <input
                      id="amendment-type"
                      type="text"
                      value={amendmentRequest.type}
                      onChange={(e) => setAmendmentRequest({ ...amendmentRequest, type: e.target.value })}
                      placeholder="e.g., Price Adjustment, Completion Date, Special Conditions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority Level</Label>
                    <div className="flex gap-4">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <label key={priority} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={amendmentRequest.priority === priority}
                            onChange={(e) =>
                              setAmendmentRequest({
                                ...amendmentRequest,
                                priority: e.target.value as "low" | "medium" | "high",
                              })
                            }
                            className="text-blue-600"
                          />
                          <span
                            className={`capitalize px-2 py-1 rounded text-sm font-medium ${getPriorityColor(priority)}`}
                          >
                            {priority}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amendment-description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="amendment-description"
                    value={amendmentRequest.description}
                    onChange={(e) => setAmendmentRequest({ ...amendmentRequest, description: e.target.value })}
                    placeholder="Describe the issue or concern that requires amendment..."
                    rows={4}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposed-change" className="text-sm font-medium">
                    Proposed Solution
                  </Label>
                  <Textarea
                    id="proposed-change"
                    value={amendmentRequest.proposedChange}
                    onChange={(e) => setAmendmentRequest({ ...amendmentRequest, proposedChange: e.target.value })}
                    placeholder="Suggest how this issue should be resolved..."
                    rows={3}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amendment-deadline" className="text-sm font-medium">
                    Response Deadline
                  </Label>
                  <input
                    id="amendment-deadline"
                    type="date"
                    value={amendmentRequest.deadline}
                    onChange={(e) => setAmendmentRequest({ ...amendmentRequest, deadline: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowAmendmentModal(false)} className="px-6">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendAmendmentRequest}
                    disabled={sendingRequest || !amendmentRequest.type || !amendmentRequest.description}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    {sendingRequest ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contract Issue Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {editingIssue ? "Edit Contract Issue" : "Add Contract Issue"}
                    </CardTitle>
                    <CardDescription>
                      {editingIssue ? "Update the contract issue details" : "Document an issue found in the contract"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowIssueModal(false)
                      setEditingIssue(null)
                      setIssueForm({
                        title: "",
                        category: "",
                        severity: "minor",
                        contractSection: "",
                        description: "",
                        proposedSolution: "",
                        legalImplications: "",
                        status: "open",
                      })
                    }}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue-title" className="text-sm font-medium">
                      Issue Title *
                    </Label>
                    <input
                      id="issue-title"
                      type="text"
                      value={issueForm.title}
                      onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <input
                      id="issue-category"
                      type="text"
                      value={issueForm.category}
                      onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                      placeholder="e.g., Price, Conditions, Dates, Legal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Severity</Label>
                    <div className="flex gap-4">
                      {(["minor", "major", "critical"] as const).map((severity) => (
                        <label key={severity} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="severity"
                            value={severity}
                            checked={issueForm.severity === severity}
                            onChange={(e) =>
                              setIssueForm({
                                ...issueForm,
                                severity: e.target.value as "critical" | "major" | "minor",
                              })
                            }
                            className="text-blue-600"
                          />
                          <span
                            className={`capitalize px-2 py-1 rounded text-sm font-medium ${
                              severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : severity === "major"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {severity}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract-section" className="text-sm font-medium">
                      Contract Section
                    </Label>
                    <input
                      id="contract-section"
                      type="text"
                      value={issueForm.contractSection}
                      onChange={(e) => setIssueForm({ ...issueForm, contractSection: e.target.value })}
                      placeholder="e.g., Clause 5.2, Schedule A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="issue-description"
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    placeholder="Detailed description of the issue..."
                    rows={4}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposed-solution" className="text-sm font-medium">
                    Proposed Solution
                  </Label>
                  <Textarea
                    id="proposed-solution"
                    value={issueForm.proposedSolution}
                    onChange={(e) => setIssueForm({ ...issueForm, proposedSolution: e.target.value })}
                    placeholder="How should this issue be resolved?"
                    rows={3}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legal-implications" className="text-sm font-medium">
                    Legal Implications
                  </Label>
                  <Textarea
                    id="legal-implications"
                    value={issueForm.legalImplications}
                    onChange={(e) => setIssueForm({ ...issueForm, legalImplications: e.target.value })}
                    placeholder="What are the potential legal consequences?"
                    rows={2}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {editingIssue && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex gap-4">
                      {(["open", "in-progress", "resolved"] as const).map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={issueForm.status === status}
                            onChange={(e) =>
                              setIssueForm({
                                ...issueForm,
                                status: e.target.value as "open" | "in-progress" | "resolved",
                              })
                            }
                            className="text-blue-600"
                          />
                          <span
                            className={`capitalize px-2 py-1 rounded text-sm font-medium ${
                              status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status.replace("-", " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowIssueModal(false)
                      setEditingIssue(null)
                      setIssueForm({
                        title: "",
                        category: "",
                        severity: "minor",
                        contractSection: "",
                        description: "",
                        proposedSolution: "",
                        legalImplications: "",
                        status: "open",
                      })
                    }}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingIssue ? handleUpdateIssue : handleAddIssue}
                    disabled={savingIssue || !issueForm.title || !issueForm.category || !issueForm.description}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    {savingIssue ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {editingIssue ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {editingIssue ? "Update Issue" : "Add Issue"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TransactionLayout>
  )
}
