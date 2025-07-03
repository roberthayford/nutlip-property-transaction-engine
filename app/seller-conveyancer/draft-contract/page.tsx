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
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
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

  // --- Real-time context (must be called at top level) -----------------------
  const { sendUpdate /*, shareDocument, downloadDocument, ...*/ } = useRealTime()

  // --------------------------------------------------------------------------
  //  Connection helpers (simple online/offline indicator)
  // --------------------------------------------------------------------------
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
      // Simulate sending process with more realistic timing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create document records for tracking (even without real-time)
      const documentRecords = uploadedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedBy: "seller-conveyancer",
        deliveredTo: "buyer-conveyancer",
        stage: "draft-contract",
        priority,
        deadline,
        coverMessage,
        uploadedAt: new Date(),
        status: "delivered" as const,
        downloadCount: 0,
      }))

      // Store documents locally for persistence
      try {
        const existingDocs = JSON.parse(localStorage.getItem("draft-contract-documents") || "[]")
        const updatedDocs = [...existingDocs, ...documentRecords]
        localStorage.setItem("draft-contract-documents", JSON.stringify(updatedDocs))
      } catch (storageError) {
        console.warn("Could not save to localStorage:", storageError)
      }

      // Try to send real-time update if available
      if (isConnected && sendUpdate) {
        try {
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
              documentIds: documentRecords.map((d) => d.id),
            },
          })
        } catch (updateError) {
          console.warn("Real-time update failed, but document was sent:", updateError)
          // Don't fail the entire operation if real-time update fails
        }
      }

      // Update statuses
      setBuyerReviewStatus("sent")
      setSentTimestamp(new Date())
      setContractPreparedStatus("completed")
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
      console.error("Send contract failed:", error)
      setSendStatus("error")
      setConnectionError("Failed to send contract. Please try again.")
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

  const isFormValid = uploadedFiles.length > 0 && coverMessage.trim().length > 0

  return (
    <TransactionLayout title="Draft Contract Review" stage="draft-contract" userRole="seller-conveyancer">
      <div className="space-y-6">
        {/* Connection Status Indicator */}
        {!isConnected && (
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Limited Connectivity</p>
                  <p className="text-sm text-amber-700">
                    {connectionError || "Real-time features may be limited. Your work will be saved locally."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Contract Progress Tracker */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Contract Progress Tracker
              {isConnected && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              )}
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
                {!isConnected && (
                  <p className="text-xs text-green-600 mt-1">
                    📱 Document saved locally. Will sync when connection is restored.
                  </p>
                )}
              </div>
            )}

            {sendStatus === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">❌ Failed to send draft contract</p>
                <p className="text-xs text-red-700 mt-1">
                  {connectionError || "Please check your connection and try again."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSendStatus("idle")}
                  className="mt-2 text-red-700 border-red-300 hover:bg-red-50"
                >
                  Try Again
                </Button>
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
      </div>
    </TransactionLayout>
  )
}
