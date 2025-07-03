"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  X,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  Reply,
  Bell,
} from "lucide-react"

// Enhanced status types for better tracking
type ContractPreparedStatus = "not-started" | "in-progress" | "completed" | "needs-revision"
type BuyerReviewStatus = "not-sent" | "sent" | "delivered" | "reviewing" | "completed" | "amendments-requested"
type ClientApprovalStatus = "not-required" | "pending" | "approved" | "rejected"

export default function SellerConveyancerDraftContractPage() {
  const { toast } = useToast()

  // Enhanced status tracking
  const [contractPreparedStatus, setContractPreparedStatus] = useState<ContractPreparedStatus>("in-progress")
  const [buyerReviewStatus, setBuyerReviewStatus] = useState<BuyerReviewStatus>("not-sent")
  const [clientApprovalStatus, setClientApprovalStatus] = useState<ClientApprovalStatus>("approved")

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

  // Amendment request handling
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedAmendment, setSelectedAmendment] = useState<string | null>(null)
  const [replyData, setReplyData] = useState({
    decision: "accepted" as "accepted" | "rejected" | "counter-proposal",
    message: "",
    counterProposal: "",
  })
  const [sendingReply, setSendingReply] = useState(false)

  // keeps track of amendments we've already shown a notification for
  const notifiedAmendments = useRef<Set<string>>(new Set())

  // Real-time context
  const { sendUpdate, addDocument, getAmendmentRequestsForRole, replyToAmendmentRequest } = useRealTime()

  // Get amendment requests sent to seller conveyancer for draft-contract stage
  const receivedAmendmentRequests = getAmendmentRequestsForRole("seller-conveyancer", "draft-contract")

  // Connection helpers (simple online/offline indicator)
  const [isConnected, setIsConnected] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsConnected(true)
    const handleOffline = () => setIsConnected(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Check for new amendment requests and show notifications
  useEffect(() => {
    const newRequests = receivedAmendmentRequests.filter(
      (req) => req.status === "pending" && !notifiedAmendments.current.has(req.id),
    )

    if (newRequests.length) {
      newRequests.forEach((req) => {
        toast({
          title: "🔔 New Amendment Request",
          description: `${req.type} amendment requested by buyer's conveyancer - ${req.priority.toUpperCase()} priority`,
          duration: 8000,
        })

        notifiedAmendments.current.add(req.id)
      })
    }
  }, [receivedAmendmentRequests, toast])

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

  // Connection monitoring
  useEffect(() => {
    const checkConnection = () => {
      try {
        // Test localStorage access
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("connection-test", "test")
          localStorage.removeItem("connection-test")
          setIsConnected(true)
          setConnectionError(null)
        }
      } catch (error) {
        setIsConnected(false)
        setConnectionError("Storage access denied")
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Platform reset detected, clearing seller conveyancer draft contract data")

      // Reset all state
      setContractPreparedStatus("in-progress")
      setBuyerReviewStatus("not-sent")
      setClientApprovalStatus("approved")
      setUploadedFiles([])
      setCoverMessage("")
      setPriority("standard")
      setDeadline("")
      setIsSending(false)
      setSendStatus("idle")
      setSentTimestamp(null)
      setDeliveredTimestamp(null)
      setShowReplyModal(false)
      setSelectedAmendment(null)
      setReplyData({
        decision: "accepted",
        message: "",
        counterProposal: "",
      })
      setSendingReply(false)
      notifiedAmendments.current.clear()

      toast({
        title: "Draft Contract Reset",
        description: "All draft contract data has been cleared and reset to default state.",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

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

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Only PDF and Word documents under 10MB are allowed",
        variant: "destructive",
      })
    }

    setUploadedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendToBuyer = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload at least one contract document",
        variant: "destructive",
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    setSendStatus("sending")

    try {
      // Simulate sending process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Add documents to the real-time system
      for (const file of uploadedFiles) {
        addDocument({
          name: file.name,
          stage: "draft-contract",
          uploadedBy: "seller-conveyancer",
          deliveredTo: "buyer-conveyancer",
          size: file.size,
          priority,
          coverMessage: coverMessage || undefined,
          deadline: deadline || undefined,
        })
      }

      // Send activity update
      sendUpdate({
        type: "document_uploaded",
        stage: "draft-contract",
        role: "seller-conveyancer",
        title: "Draft Contract Sent",
        description: `${uploadedFiles.length} contract document${uploadedFiles.length > 1 ? "s" : ""} sent to buyer's conveyancer`,
        data: {
          documentCount: uploadedFiles.length,
          priority,
          hasDeadline: !!deadline,
        },
      })

      // Update status
      setBuyerReviewStatus("sent")
      setSentTimestamp(new Date())
      setSendStatus("sent")

      // Clear form
      setUploadedFiles([])
      setCoverMessage("")
      setPriority("standard")
      setDeadline("")

      toast({
        title: "Documents Sent Successfully",
        description: "Draft contract documents have been sent to the buyer's conveyancer",
      })
    } catch (error) {
      setSendStatus("error")
      toast({
        title: "Send Failed",
        description: "Failed to send documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleReplyToAmendment = async () => {
    if (!selectedAmendment || !replyData.message) {
      toast({
        title: "Incomplete Reply",
        description: "Please provide a response message",
        variant: "destructive",
      })
      return
    }

    setSendingReply(true)

    try {
      // Simulate sending reply
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Send reply using real-time context
      replyToAmendmentRequest(selectedAmendment, {
        message: replyData.message,
        decision: replyData.decision,
        counterProposal: replyData.decision === "counter-proposal" ? replyData.counterProposal : undefined,
      })

      // Force storage event to ensure cross-tab sync
      setTimeout(() => {
        window.dispatchEvent(new Event("storage"))
      }, 100)

      // Reset form and close modal
      setReplyData({
        decision: "accepted",
        message: "",
        counterProposal: "",
      })
      setSelectedAmendment(null)
      setShowReplyModal(false)

      toast({
        title: "✅ Reply Sent Successfully",
        description: "Your response has been sent to the buyer's conveyancer and they will be notified immediately",
        duration: 6000,
      })
    } catch (error) {
      toast({
        title: "Failed to Send Reply",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSendingReply(false)
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

  const isFormValid = uploadedFiles.length > 0 && coverMessage.trim().length > 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "sent":
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-progress":
      case "reviewing":
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "needs-revision":
      case "rejected":
      case "amendments-requested":
        return "bg-red-100 text-red-800"
      case "not-started":
      case "not-sent":
      case "not-required":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "sent":
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
      case "reviewing":
      case "pending":
        return <Clock className="h-4 w-4" />
      case "needs-revision":
      case "rejected":
      case "amendments-requested":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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

  return (
    <TransactionLayout currentStage="draft-contract" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Connection Status */}
        {!isConnected && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Connection Issue: {connectionError || "You appear to be offline"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amendment Requests Section */}
        {receivedAmendmentRequests.length > 0 && (
          <Card className="border-2 border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <MessageSquare className="h-5 w-5" />
                Amendment Requests
                <Badge variant="secondary" className="ml-2">
                  {receivedAmendmentRequests.length} request{receivedAmendmentRequests.length !== 1 ? "s" : ""}
                </Badge>
                {receivedAmendmentRequests.some((req) => req.status === "pending") && (
                  <Badge className="bg-red-100 text-red-800 animate-pulse">
                    <Bell className="h-3 w-3 mr-1" />
                    Action Required
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Amendment requests received from the buyer's conveyancer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {receivedAmendmentRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${
                    request.status === "pending" ? "ring-2 ring-amber-200 bg-amber-50/20" : ""
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
                        {request.status === "pending" && (
                          <Badge className="bg-red-100 text-red-800 animate-pulse">
                            <Bell className="h-3 w-3 mr-1" />
                            Needs Reply
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Received: {request.createdAt.toLocaleDateString()} at {request.createdAt.toLocaleTimeString()}
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
                          <p className="text-sm font-medium text-gray-900 mb-1">Description:</p>
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

                        {request.reply && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Reply className="h-4 w-4 text-green-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-green-900 mb-1">
                                  Your Reply ({request.reply.decision.toUpperCase()}):
                                </p>
                                <p className="text-sm text-green-800">{request.reply.message}</p>
                                {request.reply.counterProposal && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-green-900 mb-1">Counter-proposal:</p>
                                    <p className="text-sm text-green-800">{request.reply.counterProposal}</p>
                                  </div>
                                )}
                                <p className="text-xs text-green-600 mt-2">
                                  Replied on {request.reply.repliedAt.toLocaleDateString()} at{" "}
                                  {request.reply.repliedAt.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.status === "pending" && (
                      <Button
                        onClick={() => {
                          setSelectedAmendment(request.id)
                          setShowReplyModal(true)
                        }}
                        size="sm"
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Interactive Contract Progress Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Draft Contract Status Overview
            </CardTitle>
            <CardDescription>Track the progress of the draft contract preparation and review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contract Preparation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Contract Preparation</h4>
                  <Badge className={getStatusColor(contractPreparedStatus)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(contractPreparedStatus)}
                      {contractPreparedStatus.replace("-", " ")}
                    </div>
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {contractPreparedStatus === "completed"
                    ? "Contract documents are ready for review"
                    : contractPreparedStatus === "in-progress"
                      ? "Preparing contract documents..."
                      : "Contract preparation not started"}
                </div>
              </div>

              {/* Buyer Review */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Buyer Review</h4>
                  <Badge className={getStatusColor(buyerReviewStatus)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(buyerReviewStatus)}
                      {buyerReviewStatus.replace("-", " ")}
                    </div>
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {buyerReviewStatus === "completed"
                    ? "Buyer's conveyancer has completed review"
                    : buyerReviewStatus === "reviewing"
                      ? "Under review by buyer's conveyancer"
                      : buyerReviewStatus === "delivered"
                        ? "Documents delivered, awaiting review"
                        : buyerReviewStatus === "sent"
                          ? "Documents sent, confirming delivery..."
                          : "Documents not yet sent"}
                </div>
                {sentTimestamp && <div className="text-xs text-gray-500">Sent: {sentTimestamp.toLocaleString()}</div>}
                {deliveredTimestamp && (
                  <div className="text-xs text-gray-500">Delivered: {deliveredTimestamp.toLocaleString()}</div>
                )}
              </div>

              {/* Client Approval */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Client Approval</h4>
                  <Badge className={getStatusColor(clientApprovalStatus)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(clientApprovalStatus)}
                      {clientApprovalStatus.replace("-", " ")}
                    </div>
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {clientApprovalStatus === "approved"
                    ? "Client has approved the contract terms"
                    : clientApprovalStatus === "pending"
                      ? "Awaiting client approval"
                      : clientApprovalStatus === "rejected"
                        ? "Client has requested changes"
                        : "Client approval not required at this stage"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Documents to Buyer */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Send className="h-5 w-5" />
              Send Draft Contract to Buyer's Conveyancer
            </CardTitle>
            <CardDescription>Upload and send the draft contract documents for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="contract-upload" className="text-sm font-medium">
                  Contract Documents *
                </Label>
                <div className="mt-2">
                  <input
                    id="contract-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">PDF or Word documents, max 10MB each</p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Documents ({uploadedFiles.length})</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFile(index)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cover Message */}
            <div className="space-y-2">
              <Label htmlFor="cover-message" className="text-sm font-medium">
                Cover Message (Optional)
              </Label>
              <Textarea
                id="cover-message"
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                placeholder="Add any specific instructions or notes for the buyer's conveyancer..."
                rows={3}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Priority and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority Level</Label>
                <Select
                  value={priority}
                  onValueChange={(value: "standard" | "urgent" | "critical") => setPriority(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium">
                  Response Deadline (Optional)
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Send Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSendToBuyer}
                disabled={isSending || uploadedFiles.length === 0 || !isConnected}
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                size="lg"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Sending Documents...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send to Buyer's Conveyancer
                  </>
                )}
              </Button>

              {/* Status Messages */}
              <div className="mt-4 space-y-2">
                {uploadedFiles.length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please upload at least one contract document to proceed.</span>
                  </div>
                )}

                {!isConnected && (
                  <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Connection required to send documents. Please check your internet connection.</span>
                  </div>
                )}

                {sendStatus === "sent" && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span>Documents sent successfully to buyer's conveyancer.</span>
                  </div>
                )}

                {sendStatus === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Failed to send documents. Please try again.</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Preparation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Preparation Checklist</CardTitle>
            <CardDescription>Ensure all required elements are included in the draft contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { item: "Property details and legal description", completed: contractPreparedStatus === "completed" },
                { item: "Purchase price and deposit terms", completed: contractPreparedStatus === "completed" },
                { item: "Completion date and key milestones", completed: contractPreparedStatus === "completed" },
                { item: "Special conditions and covenants", completed: contractPreparedStatus === "completed" },
                { item: "Fixtures and fittings schedule", completed: contractPreparedStatus === "completed" },
                { item: "Title documents and restrictions", completed: contractPreparedStatus === "completed" },
                {
                  item: "Planning and building regulation compliance",
                  completed: contractPreparedStatus === "completed",
                },
                { item: "Environmental searches and reports", completed: contractPreparedStatus === "completed" },
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className={task.completed ? "text-gray-900" : "text-gray-600"}>{task.item}</span>
                  {!task.completed && (
                    <Badge variant="outline" className="ml-auto">
                      To Complete
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Amendment Reply Modal */}
        {showReplyModal && selectedAmendment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Reply className="h-5 w-5" />
                      Reply to Amendment Request
                    </CardTitle>
                    <CardDescription>Provide your response to the buyer's amendment request</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowReplyModal(false)} className="h-8 w-8 p-0">
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Decision *</Label>
                  <div className="flex gap-4">
                    {(["accepted", "rejected", "counter-proposal"] as const).map((decision) => (
                      <label key={decision} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="decision"
                          value={decision}
                          checked={replyData.decision === decision}
                          onChange={(e) =>
                            setReplyData({
                              ...replyData,
                              decision: e.target.value as "accepted" | "rejected" | "counter-proposal",
                            })
                          }
                          className="text-blue-600"
                        />
                        <span
                          className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${
                            decision === "accepted"
                              ? "bg-green-100 text-green-800"
                              : decision === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {decision.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reply-message" className="text-sm font-medium">
                    Response Message *
                  </Label>
                  <Textarea
                    id="reply-message"
                    value={replyData.message}
                    onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                    placeholder="Provide your detailed response to the amendment request..."
                    rows={4}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {replyData.decision === "counter-proposal" && (
                  <div className="space-y-2">
                    <Label htmlFor="counter-proposal" className="text-sm font-medium">
                      Counter-proposal Details
                    </Label>
                    <Textarea
                      id="counter-proposal"
                      value={replyData.counterProposal}
                      onChange={(e) => setReplyData({ ...replyData, counterProposal: e.target.value })}
                      placeholder="Describe your alternative proposal..."
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowReplyModal(false)} className="px-6">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReplyToAmendment}
                    disabled={sendingReply || !replyData.message}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    {sendingReply ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending Reply...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
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
