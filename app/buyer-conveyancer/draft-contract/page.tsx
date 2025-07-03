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
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function BuyerConveyancerDraftContractPage() {
  const [amendments, setAmendments] = useState("")
  const [downloadingDocuments, setDownloadingDocuments] = useState<Set<string>>(new Set())
  const [downloadedDocuments, setDownloadedDocuments] = useState<Set<string>>(new Set())
  const [reviewStatus, setReviewStatus] = useState<"not-started" | "in-progress" | "completed">("not-started")
  const [continuingToNext, setContinuingToNext] = useState(false)

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
    (req) =>
      req.requestedBy === "buyer-conveyancer" &&
      req.stage === "draft-contract" &&
      req.requestedTo === "seller-conveyancer",
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
          title: "New Contract Received",
          description: `${doc.name} is ready for review from seller's conveyancer`,
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
    const newReplies = sentAmendmentRequests.filter((req) => {
      return req.reply && req.status === "replied" && !notifiedReplies.current.has(req.id)
    })

    if (newReplies.length) {
      newReplies.forEach((req) => {
        if (req.reply) {
          const isPositive = req.reply.decision === "accepted"
          toast({
            title: "Amendment Reply Received",
            description: `${req.type} amendment request ${req.reply.decision.replace("-", " ")} by seller's conveyancer`,
            variant: isPositive ? "default" : "destructive",
          })

          // Send activity update
          sendUpdate({
            type: "amendment_replied",
            stage: "draft-contract",
            role: "buyer-conveyancer",
            title: "Amendment Reply Received",
            description: `Reply received for ${req.type} amendment: ${req.reply.decision}`,
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
        title: "Amendment Request Sent",
        description: "Your amendment request has been sent to the seller's conveyancer",
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
            amendmentsRequested: 0,
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

  return (
    <TransactionLayout currentStage="draft-contract" userRole="buyer-conveyancer">
      <div className="space-y-6">
        {/* Amendment Request Status Section */}
        {sentAmendmentRequests.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Send className="h-5 w-5" />
                Amendment Request Status
                <Badge variant="secondary" className="ml-2">
                  {sentAmendmentRequests.length} request{sentAmendmentRequests.length !== 1 ? "s" : ""}
                </Badge>
              </CardTitle>
              <CardDescription>Track the status of your amendment requests to the seller's conveyancer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sentAmendmentRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: {request.createdAt.toLocaleDateString()}
                        </div>
                        {request.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Deadline: {new Date(request.deadline).toLocaleDateString()}
                          </div>
                        )}
                        {request.reply && (
                          <div className="flex items-center gap-1">
                            <Reply className="h-3 w-3" />
                            Replied: {request.reply.repliedAt.toLocaleDateString()}
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
                            <p className="text-sm font-medium text-gray-900 mb-1">Your Proposed Solution:</p>
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
                        {request.reply ? (
                          <div
                            className={`border rounded-lg p-4 ${
                              request.reply.decision === "accepted"
                                ? "bg-green-50 border-green-200"
                                : request.reply.decision === "rejected"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Reply
                                className={`h-4 w-4 mt-0.5 ${
                                  request.reply.decision === "accepted"
                                    ? "text-green-600"
                                    : request.reply.decision === "rejected"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p
                                    className={`text-sm font-medium ${
                                      request.reply.decision === "accepted"
                                        ? "text-green-900"
                                        : request.reply.decision === "rejected"
                                          ? "text-red-900"
                                          : "text-blue-900"
                                    }`}
                                  >
                                    Seller's Conveyancer Reply ({request.reply.decision.replace("-", " ")}):
                                  </p>
                                  <Badge className={getReplyStatusColor(request.reply.decision)}>
                                    <div className="flex items-center gap-1">
                                      {getReplyStatusIcon(request.reply.decision)}
                                      {request.reply.decision.replace("-", " ")}
                                    </div>
                                  </Badge>
                                </div>
                                <p
                                  className={`text-sm mb-2 ${
                                    request.reply.decision === "accepted"
                                      ? "text-green-800"
                                      : request.reply.decision === "rejected"
                                        ? "text-red-800"
                                        : "text-blue-800"
                                  }`}
                                >
                                  {request.reply.message}
                                </p>
                                {request.reply.counterProposal && (
                                  <div className="mt-3 p-3 bg-white border border-blue-200 rounded-lg">
                                    <p className="text-sm font-medium text-blue-900 mb-1">Counter-proposal:</p>
                                    <p className="text-sm text-blue-800">{request.reply.counterProposal}</p>
                                  </div>
                                )}
                                <p
                                  className={`text-xs mt-2 ${
                                    request.reply.decision === "accepted"
                                      ? "text-green-600"
                                      : request.reply.decision === "rejected"
                                        ? "text-red-600"
                                        : "text-blue-600"
                                  }`}
                                >
                                  Replied on {request.reply.repliedAt.toLocaleDateString()} at{" "}
                                  {request.reply.repliedAt.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-600" />
                              <p className="text-sm text-amber-800">Waiting for reply from seller's conveyancer...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Amendment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Amendment Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{sentAmendmentRequests.length}</div>
                    <div className="text-gray-600">Total Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {sentAmendmentRequests.filter((r) => r.reply?.decision === "accepted").length}
                    </div>
                    <div className="text-gray-600">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {sentAmendmentRequests.filter((r) => r.reply?.decision === "rejected").length}
                    </div>
                    <div className="text-gray-600">Rejected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {sentAmendmentRequests.filter((r) => !r.reply).length}
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Received Documents Section */}
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <FileText className="h-5 w-5" />
              Received Draft Contracts
              {receivedDocuments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {receivedDocuments.length} document{receivedDocuments.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Draft contracts received from the seller's conveyancer for your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {receivedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Received Yet</h3>
                <p className="text-gray-600">
                  Waiting for the seller's conveyancer to send the draft contract documents.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Monitoring for incoming documents...
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">{document.name}</h4>
                          <Badge className={getStatusColor(document.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(document.status)}
                              {document.status}
                            </div>
                          </Badge>
                          {document.priority && document.priority !== "standard" && (
                            <Badge
                              variant="outline"
                              className={
                                document.priority === "critical"
                                  ? "border-red-300 text-red-700"
                                  : document.priority === "urgent"
                                    ? "border-amber-300 text-amber-700"
                                    : "border-gray-300 text-gray-700"
                              }
                            >
                              {document.priority}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            From: {document.uploadedBy.replace("-", " ")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Received: {document.uploadedAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileCheck className="h-3 w-3" />
                            Size: {(document.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            Downloads: {document.downloadCount}
                          </div>
                        </div>

                        {document.coverMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-900 mb-1">Cover Message:</p>
                                <p className="text-sm text-blue-800">{document.coverMessage}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {document.deadline && (
                          <div className="flex items-center gap-2 text-sm text-amber-700 mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Response deadline: {new Date(document.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleDownloadDocument(document.id, document.name)}
                          disabled={downloadingDocuments.has(document.id)}
                          size="sm"
                          variant={downloadedDocuments.has(document.id) ? "secondary" : "default"}
                        >
                          {downloadingDocuments.has(document.id) ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Downloading...
                            </>
                          ) : downloadedDocuments.has(document.id) ? (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Re-download
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>

                        {downloadedDocuments.has(document.id) && document.status !== "reviewed" && (
                          <Button
                            onClick={() => handleMarkAsReviewed(document.id)}
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Mark Reviewed
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

        {/* Review Status Card */}
        {receivedDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review Progress
              </CardTitle>
              <CardDescription>Track your review progress of the draft contract</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Review Status:</span>
                  <Badge
                    className={
                      reviewStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : reviewStatus === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                    }
                  >
                    {reviewStatus === "completed"
                      ? "Review Complete"
                      : reviewStatus === "in-progress"
                        ? "In Progress"
                        : "Not Started"}
                  </Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      reviewStatus === "completed"
                        ? "w-full bg-green-500"
                        : reviewStatus === "in-progress"
                          ? "w-1/2 bg-blue-500"
                          : "w-0 bg-gray-400"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        receivedDocuments.some((d) => downloadedDocuments.has(d.id)) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span>Documents Downloaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        reviewStatus === "in-progress" || reviewStatus === "completed" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span>Review Started</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${reviewStatus === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>Review Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contract Review Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Review Checklist</CardTitle>
            <CardDescription>Key areas to review in the draft contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { item: "Property description and boundaries", completed: reviewStatus === "completed" },
                { item: "Purchase price and payment terms", completed: reviewStatus === "completed" },
                { item: "Completion date and timeline", completed: reviewStatus === "completed" },
                { item: "Special conditions and covenants", completed: reviewStatus === "completed" },
                { item: "Fixtures and fittings included", completed: reviewStatus === "completed" },
                { item: "Title guarantee and restrictions", completed: reviewStatus === "completed" },
                { item: "Planning permissions and building regulations", completed: reviewStatus === "completed" },
                { item: "Environmental and contamination issues", completed: reviewStatus === "completed" },
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className={task.completed ? "text-gray-900" : "text-gray-600"}>{task.item}</span>
                  {!task.completed && (
                    <Badge variant="outline" className="ml-auto">
                      To Review
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contract Issues Identified */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Contract Issues Identified
              {contractIssues.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {contractIssues.length} issue{contractIssues.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Document and track specific issues found during contract review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Issue Button */}
            <Button
              onClick={() => setShowIssueModal(true)}
              variant="outline"
              className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Add New Issue
            </Button>

            {/* Issues List */}
            {contractIssues.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Identified</h3>
                <p className="text-gray-600">
                  Issues found during contract review will appear here. Click "Add New Issue" to document any concerns.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contractIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${
                      issue.severity === "critical"
                        ? "border-red-200 bg-red-50/30"
                        : issue.severity === "major"
                          ? "border-amber-200 bg-amber-50/30"
                          : "border-blue-200 bg-blue-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                          <Badge
                            className={
                              issue.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : issue.severity === "major"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {issue.severity}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              issue.status === "resolved"
                                ? "border-green-300 text-green-700"
                                : issue.status === "in-progress"
                                  ? "border-blue-300 text-blue-700"
                                  : "border-gray-300 text-gray-700"
                            }
                          >
                            {issue.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Category:</span> {issue.category} |{" "}
                          <span className="font-medium">Section:</span> {issue.contractSection} |{" "}
                          <span className="font-medium">Identified:</span> {issue.identifiedAt.toLocaleDateString()}
                        </div>
                        <p className="text-gray-700 mb-3">{issue.description}</p>
                        {issue.proposedSolution && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-green-900 mb-1">Proposed Solution:</p>
                            <p className="text-sm text-green-800">{issue.proposedSolution}</p>
                          </div>
                        )}
                        {issue.legalImplications && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-amber-900 mb-1">Legal Implications:</p>
                            <p className="text-sm text-amber-800">{issue.legalImplications}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleEditIssue(issue)}
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {issue.status !== "resolved" && (
                          <Button
                            onClick={() => handleResolveIssue(issue.id)}
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                        )}
                        <Button
                          onClick={() => handleCreateAmendmentFromIssue(issue)}
                          size="sm"
                          variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Request Amendment
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Issues Summary */}
            {contractIssues.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Issues Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {contractIssues.filter((i) => i.severity === "critical").length}
                    </div>
                    <div className="text-gray-600">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {contractIssues.filter((i) => i.severity === "major").length}
                    </div>
                    <div className="text-gray-600">Major</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {contractIssues.filter((i) => i.severity === "minor").length}
                    </div>
                    <div className="text-gray-600">Minor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {contractIssues.filter((i) => i.status === "resolved").length}
                    </div>
                    <div className="text-gray-600">Resolved</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amendment Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Amendment Notes</CardTitle>
            <CardDescription>Document any issues or amendments needed for the contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amendments">Notes and Comments</Label>
              <Textarea
                id="amendments"
                placeholder="Document any issues, concerns, or amendments needed for the draft contract..."
                className="mt-2"
                rows={4}
                value={amendments}
                onChange={(e) => setAmendments(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Save Notes
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons - Main CTA Section */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <ArrowRight className="h-5 w-5" />
              Next Steps
            </CardTitle>
            <CardDescription>Choose your next action based on the contract review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Continue to Search & Survey Button */}
              <Button
                onClick={handleContinueToNextStage}
                disabled={continuingToNext || reviewStatus !== "completed"}
                className="flex-1 h-12 text-base font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                size="lg"
              >
                {continuingToNext ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Completing Stage...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Continue to Search & Survey
                  </>
                )}
              </Button>

              {/* Send Amendment Request Button */}
              <Button
                onClick={() => setShowAmendmentModal(true)}
                disabled={receivedDocuments.length === 0}
                variant="outline"
                className="flex-1 h-12 text-base font-medium border-2 border-amber-300 text-amber-700 hover:bg-amber-50 disabled:border-gray-300 disabled:text-gray-400"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Amendment Request
              </Button>
            </div>

            {/* Status Messages */}
            <div className="mt-4 space-y-2">
              {reviewStatus !== "completed" && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Complete the contract review by downloading and marking all documents as reviewed to continue to the
                    next stage.
                  </span>
                </div>
              )}

              {receivedDocuments.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span>Waiting for draft contract documents from the seller's conveyancer.</span>
                </div>
              )}

              {reviewStatus === "completed" && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span>Contract review completed successfully. Ready to proceed to Property Searches & Survey.</span>
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
                    <CardDescription>Provide details about the changes you need to the draft contract</CardDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="amendment-type" className="text-sm font-medium">
                    Amendment Type *
                  </Label>
                  <select
                    id="amendment-type"
                    value={amendmentRequest.type}
                    onChange={(e) => setAmendmentRequest({ ...amendmentRequest, type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select amendment type</option>
                    <option value="Price Adjustment">Price Adjustment</option>
                    <option value="Completion Date">Completion Date</option>
                    <option value="Special Conditions">Special Conditions</option>
                    <option value="Fixtures & Fittings">Fixtures & Fittings</option>
                    <option value="Legal Clauses">Legal Clauses</option>
                    <option value="Title Issues">Title Issues</option>
                    <option value="Planning Permissions">Planning Permissions</option>
                    <option value="Other">Other</option>
                  </select>
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
                          className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${
                            priority === "high"
                              ? "bg-red-100 text-red-800"
                              : priority === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amendment-description" className="text-sm font-medium">
                    Description of Required Changes *
                  </Label>
                  <Textarea
                    id="amendment-description"
                    value={amendmentRequest.description}
                    onChange={(e) => setAmendmentRequest({ ...amendmentRequest, description: e.target.value })}
                    placeholder="Describe the specific changes needed in detail..."
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
                    placeholder="Suggest how this issue should be addressed..."
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Affected Contract Clauses</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Purchase Price",
                      "Completion Date",
                      "Deposit Terms",
                      "Title Guarantee",
                      "Fixtures List",
                      "Special Conditions",
                      "Mortgage Clause",
                      "Insurance Requirements",
                    ].map((clause) => (
                      <label key={clause} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={amendmentRequest.affectedClauses.includes(clause)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAmendmentRequest((prev) => ({
                                ...prev,
                                affectedClauses: [...prev.affectedClauses, clause],
                              }))
                            } else {
                              setAmendmentRequest((prev) => ({
                                ...prev,
                                affectedClauses: prev.affectedClauses.filter((c) => c !== clause),
                              }))
                            }
                          }}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{clause}</span>
                      </label>
                    ))}
                  </div>
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
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Amendment Request
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Issue Modal */}
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
                      {editingIssue
                        ? "Update the details of this contract issue"
                        : "Document a specific issue found in the draft contract"}
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
                      placeholder="Brief title for the issue"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <select
                      id="issue-category"
                      value={issueForm.category}
                      onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Price & Payment">Price & Payment</option>
                      <option value="Property Description">Property Description</option>
                      <option value="Legal Clauses">Legal Clauses</option>
                      <option value="Title Issues">Title Issues</option>
                      <option value="Planning & Building">Planning & Building</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Fixtures & Fittings">Fixtures & Fittings</option>
                      <option value="Completion Terms">Completion Terms</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Severity Level *</Label>
                    <div className="flex gap-3">
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
                            className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${
                              severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : severity === "major"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-description" className="text-sm font-medium">
                    Issue Description *
                  </Label>
                  <Textarea
                    id="issue-description"
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    placeholder="Detailed description of the issue found..."
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
                    placeholder="What are the potential legal consequences if not addressed?"
                    rows={3}
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
                          <span className="capitalize text-sm">{status.replace("-", " ")}</span>
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
                        {editingIssue ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
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
