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
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function BuyerConveyancerDraftContractPage() {
  const [amendments, setAmendments] = useState("")
  const [downloadingDocuments, setDownloadingDocuments] = useState<Set<string>>(new Set())
  const [downloadedDocuments, setDownloadedDocuments] = useState<Set<string>>(new Set())
  const [reviewStatus, setReviewStatus] = useState<"not-started" | "in-progress" | "completed">("not-started")
  const [continuingToNext, setContinuingToNext] = useState(false)

  // NEW – keeps track of docs we've already shown a notification for
  const notifiedDocs = useRef<Set<string>>(new Set())

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

  const { getDocumentsForRole, downloadDocument, markDocumentAsReviewed, sendUpdate } = useRealTime()

  // Get documents sent to buyer conveyancer for draft-contract stage
  const receivedDocuments = getDocumentsForRole("buyer-conveyancer", "draft-contract")

  // Check if there are new documents
  useEffect(() => {
    // Only check when received documents change
    const newDelivered = receivedDocuments.filter(
      (doc) => doc.status === "delivered" && !notifiedDocs.current.has(doc.id),
    )

    if (newDelivered.length) {
      newDelivered.forEach((doc) => {
        // Send toast / activity entry once
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedDocuments]) // ✅ removed downloadedDocuments & sendUpdate

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
      }
    } catch (error) {
      console.error("Download failed:", error)
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

      // Send update to real-time system
      sendUpdate({
        type: "document_uploaded",
        stage: "draft-contract",
        role: "buyer-conveyancer",
        title: "Amendment Request Sent",
        description: `${amendmentRequest.type} amendment requested with ${amendmentRequest.priority} priority`,
        data: {
          amendmentType: amendmentRequest.type,
          priority: amendmentRequest.priority,
          deadline: amendmentRequest.deadline,
        },
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

  return (
    <TransactionLayout currentStage="draft-contract" userRole="buyer-conveyancer">
      <div className="space-y-6">
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
                            {getStatusIcon(document.status)}
                            <span className="ml-1 capitalize">{document.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                              From: {document.uploadedBy.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Received: {document.uploadedAt.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4" />
                            <span>Size: {(document.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                          {document.priority !== "standard" && (
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                className={`h-4 w-4 ${
                                  document.priority === "critical"
                                    ? "text-red-500"
                                    : document.priority === "urgent"
                                      ? "text-amber-500"
                                      : "text-blue-500"
                                }`}
                              />
                              <span className="capitalize font-medium">{document.priority} Priority</span>
                            </div>
                          )}
                        </div>

                        {document.coverMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-800 mb-1">Cover Message:</p>
                                <p className="text-sm text-blue-700">{document.coverMessage}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {document.deadline && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <p className="text-sm text-amber-800">
                                <span className="font-medium">Response Deadline:</span>{" "}
                                {new Date(document.deadline).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}

                        {document.downloadCount > 0 && (
                          <div className="text-xs text-gray-500 mb-3">
                            Downloaded {document.downloadCount} time{document.downloadCount !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => handleDownloadDocument(document.id, document.name)}
                        disabled={downloadingDocuments.has(document.id)}
                        className="flex-1"
                      >
                        {downloadingDocuments.has(document.id) ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Downloading...
                          </>
                        ) : downloadedDocuments.has(document.id) ? (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Again
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Contract
                          </>
                        )}
                      </Button>

                      {downloadedDocuments.has(document.id) && document.status !== "reviewed" && (
                        <Button variant="outline" onClick={() => handleMarkAsReviewed(document.id)} className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Reviewed
                        </Button>
                      )}

                      {document.status === "reviewed" && (
                        <Button variant="outline" disabled className="flex-1 bg-transparent">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Review Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Review Progress
            </CardTitle>
            <CardDescription>Track your review progress of the received draft contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Review Status:</span>
                <Badge
                  variant={reviewStatus === "completed" ? "default" : "secondary"}
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
                      ? "Review In Progress"
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

              <div className="text-sm text-gray-600">
                {reviewStatus === "completed"
                  ? "✅ All received contracts have been reviewed"
                  : reviewStatus === "in-progress"
                    ? "📖 Review is currently in progress"
                    : "⏳ Waiting to start review process"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Contract Issues Identified
            </CardTitle>
            <CardDescription>Issues that require attention or negotiation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-400 pl-4 py-2">
                <h4 className="font-medium text-sm">Completion Date</h4>
                <p className="text-sm text-muted-foreground">
                  Proposed completion date conflicts with buyer's mortgage offer timeline
                </p>
                <Badge variant="outline" className="mt-1">
                  High Priority
                </Badge>
              </div>
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h4 className="font-medium text-sm">Fixtures and Fittings</h4>
                <p className="text-sm text-muted-foreground">Kitchen appliances inclusion needs clarification</p>
                <Badge variant="outline" className="mt-1">
                  Medium Priority
                </Badge>
              </div>
              <div className="border-l-4 border-green-400 pl-4 py-2">
                <h4 className="font-medium text-sm">Special Conditions</h4>
                <p className="text-sm text-muted-foreground">Standard special conditions are acceptable</p>
                <Badge variant="outline" className="mt-1">
                  Resolved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Amendments */}
        <Card>
          <CardHeader>
            <CardTitle>Proposed Amendments</CardTitle>
            <CardDescription>Document amendments to be negotiated with seller's conveyancer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amendments">Amendment Notes</Label>
              <Textarea
                id="amendments"
                placeholder="Document proposed amendments and negotiation points..."
                className="mt-2"
                rows={4}
                value={amendments}
                onChange={(e) => setAmendments(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Save Amendment Notes
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={async () => {
              setContinuingToNext(true)

              // Send stage completion update
              sendUpdate({
                type: "stage_completed",
                stage: "draft-contract",
                role: "buyer-conveyancer",
                title: "Draft Contract Stage Completed",
                description: "Draft contract preparation has been completed and reviewed",
                data: {
                  draftContract: {
                    status: "completed",
                    completedBy: "Buyer Conveyancer",
                    completedAt: new Date().toISOString(),
                    contractType: "Standard Residential Purchase",
                    specialConditions: [
                      "Subject to satisfactory property searches",
                      "Subject to mortgage approval",
                      "Fixtures and fittings as per agreed list",
                    ],
                    nextStage: "Property Searches & Survey",
                  },
                },
              })

              // Simulate processing time
              await new Promise((resolve) => setTimeout(resolve, 2000))

              // Navigate to next stage
              window.location.href = "/buyer-conveyancer/search-survey"
            }}
            disabled={continuingToNext}
            className="flex items-center gap-2"
          >
            {continuingToNext ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Completing Stage...
              </>
            ) : (
              "Continue to Search & Survey"
            )}
          </Button>
          <Button
            variant="outline"
            disabled={receivedDocuments.length === 0}
            onClick={() => setShowAmendmentModal(true)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Send Amendment Request
          </Button>
        </div>

        {/* Amendment Request Modal */}
        {showAmendmentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Send Amendment Request</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAmendmentModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Amendment Type */}
                  <div>
                    <Label htmlFor="amendment-type" className="text-sm font-medium">
                      Amendment Type *
                    </Label>
                    <select
                      id="amendment-type"
                      value={amendmentRequest.type}
                      onChange={(e) => setAmendmentRequest((prev) => ({ ...prev, type: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select amendment type</option>
                      <option value="Completion Date">Completion Date</option>
                      <option value="Purchase Price">Purchase Price</option>
                      <option value="Fixtures and Fittings">Fixtures and Fittings</option>
                      <option value="Special Conditions">Special Conditions</option>
                      <option value="Title Guarantee">Title Guarantee</option>
                      <option value="Deposit Amount">Deposit Amount</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Priority Level */}
                  <div>
                    <Label className="text-sm font-medium">Priority Level</Label>
                    <div className="mt-2 flex gap-4">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <label key={priority} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={amendmentRequest.priority === priority}
                            onChange={(e) =>
                              setAmendmentRequest((prev) => ({ ...prev, priority: e.target.value as any }))
                            }
                            className="text-blue-600"
                          />
                          <span
                            className={`capitalize px-2 py-1 rounded text-xs font-medium ${
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

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Issue Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue that requires amendment..."
                      value={amendmentRequest.description}
                      onChange={(e) => setAmendmentRequest((prev) => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Proposed Change */}
                  <div>
                    <Label htmlFor="proposed-change" className="text-sm font-medium">
                      Proposed Change
                    </Label>
                    <Textarea
                      id="proposed-change"
                      placeholder="Describe your proposed amendment..."
                      value={amendmentRequest.proposedChange}
                      onChange={(e) => setAmendmentRequest((prev) => ({ ...prev, proposedChange: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Response Deadline */}
                  <div>
                    <Label htmlFor="deadline" className="text-sm font-medium">
                      Response Deadline
                    </Label>
                    <input
                      type="date"
                      id="deadline"
                      value={amendmentRequest.deadline}
                      onChange={(e) => setAmendmentRequest((prev) => ({ ...prev, deadline: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Affected Clauses */}
                  <div>
                    <Label className="text-sm font-medium">Affected Contract Clauses</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {[
                        "Completion Date",
                        "Purchase Price",
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
                            className="text-blue-600"
                          />
                          <span className="text-sm">{clause}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-6 border-t mt-6">
                  <Button variant="outline" onClick={() => setShowAmendmentModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendAmendmentRequest}
                    disabled={sendingRequest || !amendmentRequest.type || !amendmentRequest.description}
                    className="flex-1"
                  >
                    {sendingRequest ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Amendment Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TransactionLayout>
  )
}
