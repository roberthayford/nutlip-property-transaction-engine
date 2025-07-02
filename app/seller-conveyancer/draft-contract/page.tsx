"use client"

import type React from "react"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRealTime } from "@/contexts/real-time-context"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  MessageSquare,
  Upload,
  Send,
  X,
  Calendar,
  AlertCircle,
  Eye,
  Download,
  ThumbsUp,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react"

// Enhanced status types for better tracking
type ContractPreparedStatus = "not-started" | "in-progress" | "completed" | "needs-revision"
type BuyerReviewStatus = "not-sent" | "sent" | "delivered" | "reviewing" | "completed" | "amendments-requested"
type ClientApprovalStatus = "not-required" | "pending" | "approved" | "rejected"

export default function SellerConveyancerDraftContractPage() {
  const [contractStatus, setContractStatus] = useState<"draft" | "reviewed" | "amended" | "approved">("draft")
  const [amendments, setAmendments] = useState("")

  // Enhanced status tracking
  const [contractPreparedStatus, setContractPreparedStatus] = useState<ContractPreparedStatus>("in-progress")
  const [buyerReviewStatus, setBuyerReviewStatus] = useState<BuyerReviewStatus>("not-sent")
  const [clientApprovalStatus, setClientApprovalStatus] = useState<ClientApprovalStatus>("approved")

  // Contract Issues state
  const [contractIssues, setContractIssues] = useState([
    {
      id: 1,
      type: "critical",
      title: "Completion Date Conflict",
      description:
        "The proposed completion date (15th March 2024) conflicts with the seller's moving arrangements. Seller cannot complete before 22nd March 2024.",
      clause: "4.1 - Completion",
      identifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      impact: "High",
      status: "open",
      assignedTo: "client",
    },
    {
      id: 2,
      type: "critical",
      title: "Missing Property Information",
      description:
        "Property Information Form (TA6) has not been completed. Required for contract exchange. Missing details about boundaries, disputes, and planning permissions.",
      clause: "Document: TA6 Form",
      identifiedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      impact: "High",
      status: "open",
      assignedTo: "client",
    },
    {
      id: 3,
      type: "high",
      title: "Fixtures & Fittings Dispute",
      description:
        "Buyer expects kitchen appliances to be included, but seller intends to remove them. Fixtures and fittings list needs clarification.",
      clause: "Schedule 2",
      identifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      impact: "Medium",
      status: "open",
      assignedTo: "buyer-conveyancer",
    },
    {
      id: 4,
      type: "high",
      title: "Deposit Amount Discrepancy",
      description:
        "Contract states 10% deposit (£45,000) but buyer's mortgage offer indicates they can only provide 5% deposit (£22,500).",
      clause: "2.2 - Deposit",
      identifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      impact: "Medium",
      status: "open",
      assignedTo: "buyer-conveyancer",
    },
    {
      id: 5,
      type: "high",
      title: "Chain Dependency Risk",
      description:
        "Seller's onward purchase is not yet secured. Risk of chain collapse if seller's purchase falls through.",
      clause: "Risk: Chain Break",
      identifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      impact: "High",
      status: "open",
      assignedTo: "client",
    },
    {
      id: 6,
      type: "medium",
      title: "Energy Performance Certificate Expiry",
      description:
        "Current EPC expires in 3 months. While valid for completion, buyer may request updated certificate for mortgage purposes.",
      clause: "Document: EPC",
      identifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      impact: "Low",
      status: "open",
      assignedTo: "self",
    },
  ])

  const [resolvedIssues, setResolvedIssues] = useState([
    {
      id: 101,
      title: "Purchase Price Typo Corrected",
      description: "Contract showed £449,000 instead of £450,000",
      resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 102,
      title: "Boundary Plan Updated",
      description: "Provided correct boundary plan from Land Registry",
      resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 103,
      title: "Management Company Details Added",
      description: "Included service charge and management contact information",
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 104,
      title: "Special Conditions Clarified",
      description: "Clarified parking space allocation and garden maintenance",
      resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ])

  // Modal states
  const [showContactModal, setShowContactModal] = useState(false)
  const [showAmendmentModal, setShowAmendmentModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [contactMessage, setContactMessage] = useState("")
  const [amendmentRequest, setAmendmentRequest] = useState("")
  const [uploadFiles, setUploadFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Document sending state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [coverMessage, setCoverMessage] = useState("")
  const [priority, setPriority] = useState<"standard" | "urgent" | "critical">("standard")
  const [deadline, setDeadline] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  // Tracking timestamps
  const [sentTimestamp, setSentTimestamp] = useState<Date | null>(null)
  const [deliveredTimestamp, setDeliveredTimestamp] = useState<Date | null>(null)

  const { sendUpdate, shareDocument } = useRealTime()

  // Simulate buyer review progress
  useEffect(() => {
    if (buyerReviewStatus === "sent") {
      // Simulate delivery confirmation after 3 seconds
      const deliveryTimer = setTimeout(() => {
        setBuyerReviewStatus("delivered")
        setDeliveredTimestamp(new Date())
      }, 3000)

      // Simulate buyer starting review after 10 seconds
      const reviewTimer = setTimeout(() => {
        setBuyerReviewStatus("reviewing")
      }, 10000)

      return () => {
        clearTimeout(deliveryTimer)
        clearTimeout(reviewTimer)
      }
    }
  }, [buyerReviewStatus])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })
    setUploadedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendContract = async () => {
    if (uploadedFiles.length === 0 || !coverMessage.trim()) {
      return
    }

    setIsSending(true)
    setSendStatus("sending")

    try {
      // Simulate sending process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Share documents through the real-time system
      for (const file of uploadedFiles) {
        shareDocument({
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedBy: "seller-conveyancer",
          stage: "draft-contract",
          priority,
          deadline,
          coverMessage,
          blob: file,
        })
      }

      // Update statuses
      setBuyerReviewStatus("sent")
      setSentTimestamp(new Date())
      setContractPreparedStatus("completed")

      // Send real-time update
      sendUpdate({
        type: "document_uploaded",
        stage: "draft-contract",
        role: "seller-conveyancer",
        title: "Draft Contract Sent",
        description: `Draft contract sent to buyer's conveyancer for review (Priority: ${priority})`,
        data: {
          files: uploadedFiles.map((f) => f.name),
          message: coverMessage,
          priority,
          deadline,
        },
      })

      setSendStatus("sent")

      // Reset form after successful send
      setTimeout(() => {
        setUploadedFiles([])
        setCoverMessage("")
        setPriority("standard")
        setDeadline("")
        setSendStatus("idle")
      }, 3000)
    } catch (error) {
      setSendStatus("error")
    } finally {
      setIsSending(false)
    }
  }

  const handleMarkContractComplete = () => {
    setContractPreparedStatus("completed")
  }

  const handleRequestClientApproval = () => {
    setClientApprovalStatus("pending")
    // Simulate client approval after 5 seconds
    setTimeout(() => {
      setClientApprovalStatus("approved")
    }, 5000)
  }

  // Issue handling functions
  const handleContactClient = (issue) => {
    setSelectedIssue(issue)
    setShowContactModal(true)
  }

  const handleRequestAmendment = (issue) => {
    setSelectedIssue(issue)
    setShowAmendmentModal(true)
  }

  const handleUploadForm = (issue) => {
    setSelectedIssue(issue)
    setShowUploadModal(true)
  }

  const handleResolveIssue = (issueId) => {
    const issue = contractIssues.find((i) => i.id === issueId)
    if (issue) {
      // Move to resolved issues
      setResolvedIssues((prev) => [
        {
          id: Date.now(),
          title: issue.title,
          description: issue.description,
          resolvedAt: new Date(),
        },
        ...prev,
      ])

      // Remove from active issues
      setContractIssues((prev) => prev.filter((i) => i.id !== issueId))

      // Send real-time update
      sendUpdate({
        type: "issue_resolved",
        stage: "draft-contract",
        role: "seller-conveyancer",
        title: "Contract Issue Resolved",
        description: `Resolved: ${issue.title}`,
        data: { issueId, title: issue.title },
      })
    }
  }

  const handleSendContact = async () => {
    if (!contactMessage.trim() || !selectedIssue) return

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Send real-time update
      sendUpdate({
        type: "client_contacted",
        stage: "draft-contract",
        role: "seller-conveyancer",
        title: "Client Contacted",
        description: `Contacted client regarding: ${selectedIssue.title}`,
        data: { issueId: selectedIssue.id, message: contactMessage },
      })

      setShowContactModal(false)
      setContactMessage("")
      setSelectedIssue(null)
    } catch (error) {
      console.error("Failed to send contact:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSendAmendment = async () => {
    if (!amendmentRequest.trim() || !selectedIssue) return

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Send real-time update
      sendUpdate({
        type: "amendment_requested",
        stage: "draft-contract",
        role: "seller-conveyancer",
        title: "Amendment Requested",
        description: `Amendment requested for: ${selectedIssue.title}`,
        data: { issueId: selectedIssue.id, request: amendmentRequest },
      })

      setShowAmendmentModal(false)
      setAmendmentRequest("")
      setSelectedIssue(null)
    } catch (error) {
      console.error("Failed to send amendment:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUploadForIssue = (event) => {
    const files = Array.from(event.target.files || [])
    setUploadFiles((prev) => [...prev, ...files])
  }

  const handleSubmitUpload = async () => {
    if (uploadFiles.length === 0 || !selectedIssue) return

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Send real-time update
      sendUpdate({
        type: "document_uploaded",
        stage: "draft-contract",
        role: "seller-conveyancer",
        title: "Document Uploaded",
        description: `Uploaded documents for: ${selectedIssue.title}`,
        data: { issueId: selectedIssue.id, files: uploadFiles.map((f) => f.name) },
      })

      setShowUploadModal(false)
      setUploadFiles([])
      setSelectedIssue(null)
    } catch (error) {
      console.error("Failed to upload:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getIssueStats = () => {
    const critical = contractIssues.filter((i) => i.type === "critical").length
    const high = contractIssues.filter((i) => i.type === "high").length
    const medium = contractIssues.filter((i) => i.type === "medium").length
    const resolved = resolvedIssues.length

    return { critical, high, medium, resolved }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const isFormValid = uploadedFiles.length > 0 && coverMessage.trim().length > 0

  return (
    <TransactionLayout title="Draft Contract Review" stage="draft-contract" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Interactive Contract Progress Tracker */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Contract Progress Tracker
            </CardTitle>
            <CardDescription>Track the progress of your draft contract through each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Contract Prepared */}
              <div
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  contractPreparedStatus === "completed"
                    ? "border-green-300 bg-green-50"
                    : contractPreparedStatus === "in-progress"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {contractPreparedStatus === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : contractPreparedStatus === "in-progress" ? (
                      <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-semibold text-sm">Contract Prepared</span>
                  </div>
                  <Badge
                    variant={contractPreparedStatus === "completed" ? "default" : "secondary"}
                    className={
                      contractPreparedStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : contractPreparedStatus === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                    }
                  >
                    {contractPreparedStatus === "completed"
                      ? "Complete"
                      : contractPreparedStatus === "in-progress"
                        ? "In Progress"
                        : "Pending"}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  {contractPreparedStatus === "completed"
                    ? "Contract is ready and has been prepared successfully"
                    : "Preparing contract with all necessary details and clauses"}
                </p>

                <div className="space-y-2">
                  {contractPreparedStatus === "in-progress" && (
                    <Button size="sm" onClick={handleMarkContractComplete} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Complete
                    </Button>
                  )}

                  {contractPreparedStatus === "completed" && (
                    <div className="flex items-center gap-1 text-xs text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      Ready for buyer review
                    </div>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg">
                  <div
                    className={`h-full rounded-b-lg transition-all duration-500 ${
                      contractPreparedStatus === "completed"
                        ? "w-full bg-green-500"
                        : contractPreparedStatus === "in-progress"
                          ? "w-3/4 bg-blue-500"
                          : "w-1/4 bg-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* 2. Buyer Review */}
              <div
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  buyerReviewStatus === "completed"
                    ? "border-green-300 bg-green-50"
                    : buyerReviewStatus === "reviewing"
                      ? "border-amber-300 bg-amber-50"
                      : buyerReviewStatus === "delivered" || buyerReviewStatus === "sent"
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {buyerReviewStatus === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : buyerReviewStatus === "reviewing" ? (
                      <Eye className="h-5 w-5 text-amber-600" />
                    ) : buyerReviewStatus === "delivered" ? (
                      <Download className="h-5 w-5 text-blue-600" />
                    ) : buyerReviewStatus === "sent" ? (
                      <Send className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-semibold text-sm">Buyer Review</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      buyerReviewStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : buyerReviewStatus === "reviewing"
                          ? "bg-amber-100 text-amber-800"
                          : buyerReviewStatus === "delivered" || buyerReviewStatus === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                    }
                  >
                    {buyerReviewStatus === "completed"
                      ? "Complete"
                      : buyerReviewStatus === "reviewing"
                        ? "Reviewing"
                        : buyerReviewStatus === "delivered"
                          ? "Delivered"
                          : buyerReviewStatus === "sent"
                            ? "Sent"
                            : "Not Sent"}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  {buyerReviewStatus === "completed"
                    ? "Buyer's conveyancer has completed their review"
                    : buyerReviewStatus === "reviewing"
                      ? "Buyer's conveyancer is currently reviewing the contract"
                      : buyerReviewStatus === "delivered"
                        ? "Contract delivered and awaiting buyer's conveyancer review"
                        : buyerReviewStatus === "sent"
                          ? "Contract sent, awaiting delivery confirmation"
                          : "Waiting for contract to be sent to buyer's conveyancer"}
                </p>

                <div className="space-y-2">
                  {sentTimestamp && <div className="text-xs text-gray-500">Sent: {sentTimestamp.toLocaleString()}</div>}

                  {deliveredTimestamp && (
                    <div className="text-xs text-green-600">Delivered: {deliveredTimestamp.toLocaleString()}</div>
                  )}

                  {buyerReviewStatus === "reviewing" && (
                    <div className="flex items-center gap-1 text-xs text-amber-700">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Review in progress...
                    </div>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg">
                  <div
                    className={`h-full rounded-b-lg transition-all duration-500 ${
                      buyerReviewStatus === "completed"
                        ? "w-full bg-green-500"
                        : buyerReviewStatus === "reviewing"
                          ? "w-3/4 bg-amber-500"
                          : buyerReviewStatus === "delivered"
                            ? "w-2/3 bg-blue-500"
                            : buyerReviewStatus === "sent"
                              ? "w-1/3 bg-blue-400"
                              : "w-0 bg-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* 3. Client Approval */}
              <div
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  clientApprovalStatus === "approved"
                    ? "border-green-300 bg-green-50"
                    : clientApprovalStatus === "pending"
                      ? "border-amber-300 bg-amber-50"
                      : clientApprovalStatus === "rejected"
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {clientApprovalStatus === "approved" ? (
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                    ) : clientApprovalStatus === "pending" ? (
                      <Clock className="h-5 w-5 text-amber-600" />
                    ) : clientApprovalStatus === "rejected" ? (
                      <X className="h-5 w-5 text-red-600" />
                    ) : (
                      <Users className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-semibold text-sm">Client Approval</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      clientApprovalStatus === "approved"
                        ? "bg-green-100 text-green-800"
                        : clientApprovalStatus === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : clientApprovalStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                    }
                  >
                    {clientApprovalStatus === "approved"
                      ? "Approved"
                      : clientApprovalStatus === "pending"
                        ? "Pending"
                        : clientApprovalStatus === "rejected"
                          ? "Rejected"
                          : "Not Required"}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  {clientApprovalStatus === "approved"
                    ? "Your client has approved the contract terms"
                    : clientApprovalStatus === "pending"
                      ? "Waiting for client approval of contract terms"
                      : clientApprovalStatus === "rejected"
                        ? "Client has requested changes to the contract"
                        : "Client approval obtained for contract preparation"}
                </p>

                <div className="space-y-2">
                  {clientApprovalStatus === "not-required" && (
                    <Button
                      size="sm"
                      onClick={handleRequestClientApproval}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Request Approval
                    </Button>
                  )}

                  {clientApprovalStatus === "pending" && (
                    <div className="flex items-center gap-1 text-xs text-amber-700">
                      <Clock className="h-3 w-3" />
                      Awaiting client response...
                    </div>
                  )}

                  {clientApprovalStatus === "approved" && (
                    <div className="flex items-center gap-1 text-xs text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      Ready to proceed
                    </div>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg">
                  <div
                    className={`h-full rounded-b-lg transition-all duration-500 ${
                      clientApprovalStatus === "approved"
                        ? "w-full bg-green-500"
                        : clientApprovalStatus === "pending"
                          ? "w-2/3 bg-amber-500"
                          : clientApprovalStatus === "rejected"
                            ? "w-1/3 bg-red-500"
                            : "w-full bg-green-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Overall Progress Flow */}
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    contractPreparedStatus === "completed" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div
                  className={`w-3 h-3 rounded-full ${buyerReviewStatus !== "not-sent" ? "bg-blue-500" : "bg-gray-300"}`}
                />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div
                  className={`w-3 h-3 rounded-full ${
                    clientApprovalStatus === "approved" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Draft Contract Component - MANDATORY */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Send className="h-5 w-5" />
              Send Draft Contract to Buyer's Conveyancer
            </CardTitle>
            <CardDescription>
              Upload and send the draft contract document to the buyer's conveyancer for review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-3">
              <Label htmlFor="contract-upload" className="text-sm font-medium">
                Upload Draft Contract Document *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop your contract document here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mb-3">Supports PDF, DOC, DOCX files up to 10MB</p>
                <Input
                  id="contract-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("contract-upload")?.click()}
                  type="button"
                >
                  Choose Files
                </Button>
              </div>

              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files:</Label>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cover Message */}
            <div className="space-y-2">
              <Label htmlFor="cover-message" className="text-sm font-medium">
                Cover Message to Buyer's Conveyancer *
              </Label>
              <Textarea
                id="cover-message"
                placeholder="Please provide any specific instructions, notes, or requirements for the buyer's conveyancer regarding this draft contract..."
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">{coverMessage.length}/500 characters</p>
            </div>

            {/* Priority and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority Level
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value: "standard" | "urgent" | "critical") => setPriority(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Standard
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        Urgent
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Critical
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium">
                  Response Deadline
                </Label>
                <div className="relative">
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {!isFormValid && (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Please upload a document and add a cover message
                  </>
                )}
              </div>

              <Button
                onClick={handleSendContract}
                disabled={!isFormValid || isSending || contractPreparedStatus !== "completed"}
                className={`min-w-[200px] ${
                  sendStatus === "sent"
                    ? "bg-green-600 hover:bg-green-700"
                    : sendStatus === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : ""
                }`}
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Contract...
                  </>
                ) : sendStatus === "sent" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Contract Sent Successfully!
                  </>
                ) : sendStatus === "error" ? (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Send Failed - Retry
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Draft Contract
                  </>
                )}
              </Button>
            </div>

            {/* Status Messages */}
            {sendStatus === "sent" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Draft contract successfully sent to buyer's conveyancer
                </p>
                <p className="text-xs text-green-700 mt-1">
                  They will be notified immediately and can begin their review process.
                </p>
              </div>
            )}

            {sendStatus === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">❌ Failed to send draft contract</p>
                <p className="text-xs text-red-700 mt-1">Please check your connection and try again.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Preparation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Preparation Checklist</CardTitle>
            <CardDescription>Essential items to include in the draft contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { item: "Property description and title details", completed: true },
                { item: "Purchase price and deposit amount", completed: true },
                { item: "Completion date (subject to agreement)", completed: true },
                { item: "Special conditions and covenants", completed: true },
                { item: "Fixtures and fittings schedule", completed: false },
                { item: "Energy Performance Certificate", completed: true },
                { item: "Property information forms", completed: false },
                { item: "Management company details (if applicable)", completed: true },
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
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contract Amendments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contract Amendments
            </CardTitle>
            <CardDescription>Track and manage requested amendments to the contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amendments">Amendment Notes</Label>
              <Textarea
                id="amendments"
                placeholder="Record any amendments requested by the buyer's conveyancer or other parties..."
                value={amendments}
                onChange={(e) => setAmendments(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setContractStatus("reviewed")} disabled={contractStatus === "approved"}>
                Mark as Reviewed
              </Button>
              <Button
                variant="outline"
                onClick={() => setContractStatus("amended")}
                disabled={contractStatus === "approved"}
              >
                Request Amendments
              </Button>
              <Button
                variant="default"
                onClick={() => setContractStatus("approved")}
                disabled={contractStatus !== "reviewed"}
              >
                Approve Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract Issues Identified */}
        <Card className="border-2 border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Contract Issues Identified
            </CardTitle>
            <CardDescription>
              Track and resolve identified issues in the draft contract before finalization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Issues Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-100 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Critical Issues</span>
                </div>
                <div className="text-2xl font-bold text-red-700">{getIssueStats().critical}</div>
                <p className="text-xs text-red-600">Require immediate attention</p>
              </div>

              <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">High Priority</span>
                </div>
                <div className="text-2xl font-bold text-amber-700">{getIssueStats().high}</div>
                <p className="text-xs text-amber-600">Need resolution soon</p>
              </div>

              <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Medium Priority</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{getIssueStats().medium}</div>
                <p className="text-xs text-blue-600">Can be addressed later</p>
              </div>

              <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Resolved</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{getIssueStats().resolved}</div>
                <p className="text-xs text-green-600">Issues fixed</p>
              </div>
            </div>

            {/* Active Issues List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Active Issues Requiring Attention</h4>
                <Badge variant="outline" className="text-red-600 border-red-300">
                  {contractIssues.length} Open Issues
                </Badge>
              </div>

              {/* Dynamic Issues Rendering */}
              <div className="space-y-3">
                {contractIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 border-l-4 rounded-r-lg ${
                      issue.type === "critical"
                        ? "bg-red-50 border-red-500"
                        : issue.type === "high"
                          ? "bg-amber-50 border-amber-500"
                          : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {issue.type === "critical" ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : issue.type === "high" ? (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-600" />
                          )}
                          <Badge
                            variant={issue.type === "critical" ? "destructive" : "secondary"}
                            className={`text-xs ${
                              issue.type === "critical"
                                ? ""
                                : issue.type === "high"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {issue.type.toUpperCase()}
                          </Badge>
                          <span
                            className={`text-sm font-medium ${
                              issue.type === "critical"
                                ? "text-red-800"
                                : issue.type === "high"
                                  ? "text-amber-800"
                                  : "text-blue-800"
                            }`}
                          >
                            {issue.title}
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-2 ${
                            issue.type === "critical"
                              ? "text-red-700"
                              : issue.type === "high"
                                ? "text-amber-700"
                                : "text-blue-700"
                          }`}
                        >
                          {issue.description}
                        </p>
                        <div
                          className={`flex items-center gap-4 text-xs ${
                            issue.type === "critical"
                              ? "text-red-600"
                              : issue.type === "high"
                                ? "text-amber-600"
                                : "text-blue-600"
                          }`}
                        >
                          <span>{issue.clause}</span>
                          <span>Identified: {formatTimeAgo(issue.identifiedAt)}</span>
                          <span>Impact: {issue.impact}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {issue.assignedTo === "client" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContactClient(issue)}
                            className={`${
                              issue.type === "critical"
                                ? "text-red-700 border-red-300 hover:bg-red-100"
                                : issue.type === "high"
                                  ? "text-amber-700 border-amber-300 hover:bg-amber-100"
                                  : "text-blue-700 border-blue-300 hover:bg-blue-100"
                            } bg-transparent`}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contact Client
                          </Button>
                        )}
                        {issue.assignedTo === "buyer-conveyancer" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestAmendment(issue)}
                            className={`${
                              issue.type === "critical"
                                ? "text-red-700 border-red-300 hover:bg-red-100"
                                : issue.type === "high"
                                  ? "text-amber-700 border-amber-300 hover:bg-amber-100"
                                  : "text-blue-700 border-blue-300 hover:bg-blue-100"
                            } bg-transparent`}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Request Amendment
                          </Button>
                        )}
                        {issue.title.includes("Missing") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUploadForm(issue)}
                            className="text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload Form
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleResolveIssue(issue.id)}
                          className={`${
                            issue.type === "critical"
                              ? "bg-red-600 hover:bg-red-700"
                              : issue.type === "high"
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issue Resolution Actions */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Issue Resolution Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Issues Report
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Send className="h-4 w-4 mr-1" />
                    Send Issues Summary
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Client Communication</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {contractIssues.filter((i) => i.assignedTo === "client").length} issues require immediate client
                    consultation
                  </p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Contact Client
                  </Button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Buyer's Conveyancer</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {contractIssues.filter((i) => i.assignedTo === "buyer-conveyancer").length} issues need discussion
                    with buyer's side
                  </p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Send Correspondence
                  </Button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Document Updates</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {
                      contractIssues.filter((i) => i.title.includes("Missing") || i.title.includes("Discrepancy"))
                        .length
                    }{" "}
                    issues require contract amendment
                  </p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Amend Contract
                  </Button>
                </div>
              </div>
            </div>

            {/* Recently Resolved Issues */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-gray-900">Recently Resolved Issues</h4>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {resolvedIssues.length} Resolved
                </Badge>
              </div>

              <div className="space-y-2">
                {resolvedIssues.map((issue) => (
                  <div key={issue.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-green-800">{issue.title}</span>
                        <p className="text-xs text-green-600">{issue.description}</p>
                      </div>
                      <div className="text-xs text-green-600">Resolved {formatTimeAgo(issue.resolvedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Client Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Contact Client</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowContactModal(false)} className="p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {selectedIssue && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">{selectedIssue.title}</p>
                  <p className="text-xs text-gray-600">{selectedIssue.description}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact-message">Message to Client</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Explain the issue and request client input..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowContactModal(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendContact} disabled={!contactMessage.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amendment Request Modal */}
        {showAmendmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Request Amendment</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAmendmentModal(false)} className="p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {selectedIssue && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">{selectedIssue.title}</p>
                  <p className="text-xs text-gray-600">{selectedIssue.description}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="amendment-request">Amendment Request</Label>
                  <Textarea
                    id="amendment-request"
                    placeholder="Describe the required amendment and proposed solution..."
                    value={amendmentRequest}
                    onChange={(e) => setAmendmentRequest(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAmendmentModal(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendAmendment} disabled={!amendmentRequest.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
              </div>
            </div>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Document</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)} className="p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {selectedIssue && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">{selectedIssue.title}</p>
                  <p className="text-xs text-gray-600">{selectedIssue.description}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="issue-upload">Upload Required Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Choose files to upload</p>
                    <Input
                      id="issue-upload"
                      type="file"
                      multiple
                      onChange={handleFileUploadForIssue}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("issue-upload")?.click()}
                      type="button"
                    >
                      Choose Files
                    </Button>
                  </div>

                  {uploadFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadFiles((prev) => prev.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowUploadModal(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitUpload} disabled={uploadFiles.length === 0 || isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Important Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Contract Accuracy</p>
                <p className="text-amber-700">
                  Ensure all property details, purchase price, and special conditions are accurate before sending to the
                  buyer's conveyancer.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Client Communication</p>
                <p className="text-blue-700">
                  Keep your client informed of any amendments or delays in the contract preparation process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
