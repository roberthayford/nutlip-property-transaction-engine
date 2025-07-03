"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRealTime } from "@/contexts/real-time-context"
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Bell,
  RefreshCw,
  ArrowRight,
  Eye,
  Download,
} from "lucide-react"

export default function EstateAgentEnquiriesPage() {
  const { toast } = useToast()
  const { updates, getDocumentsForRole, sendUpdate } = useRealTime()

  // Notification status state
  const [notificationStatus, setNotificationStatus] = useState<"awaiting" | "completed">("awaiting")
  const [completionData, setCompletionData] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Get documents for estate agent in enquiries stage
  const receivedDocuments = getDocumentsForRole("estate-agent", "enquiries")

  // Listen for enquiries completion updates from buyer-conveyancer
  useEffect(() => {
    const enquiriesCompletionUpdate = updates.find(
      (update) =>
        update.type === "stage_completed" &&
        update.stage === "enquiries" &&
        update.role === "buyer-conveyancer" &&
        update.data?.enquiries,
    )

    if (enquiriesCompletionUpdate && notificationStatus === "awaiting") {
      // Update notification status to completed
      setNotificationStatus("completed")
      setCompletionData(enquiriesCompletionUpdate.data.enquiries)
      setLastUpdate(new Date(enquiriesCompletionUpdate.createdAt))

      // Show toast notification
      toast({
        title: "Enquiries Stage Completed! 🎉",
        description: "The buyer's conveyancer has completed the enquiries stage and is proceeding to mortgage offer.",
      })

      // Send acknowledgment update
      sendUpdate({
        type: "status_changed",
        stage: "enquiries",
        role: "estate-agent",
        title: "Enquiries Completion Acknowledged",
        description: "Estate agent has been notified of enquiries stage completion",
        data: {
          acknowledgedAt: new Date().toISOString(),
          completionData: enquiriesCompletionUpdate.data,
        },
      })
    }
  }, [updates, notificationStatus, toast, sendUpdate])

  // Listen for platform reset events
  useEffect(() => {
    const handlePlatformReset = () => {
      console.log("Platform reset detected, clearing estate agent enquiries data")

      // Reset all state
      setNotificationStatus("awaiting")
      setCompletionData(null)
      setLastUpdate(null)

      toast({
        title: "Enquiries Reset",
        description: "All enquiries data has been cleared and reset to default state.",
      })
    }

    window.addEventListener("platform-reset", handlePlatformReset)
    return () => window.removeEventListener("platform-reset", handlePlatformReset)
  }, [toast])

  const handleViewNextStage = () => {
    window.location.href = "/estate-agent/mortgage-offer"
  }

  return (
    <TransactionLayout currentStage="enquiries" userRole="estate-agent">
      <div className="space-y-6">
        {/* Notification Status Section */}
        <Card
          className={`border-2 ${notificationStatus === "completed" ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${notificationStatus === "completed" ? "text-green-800" : "text-amber-800"}`}
            >
              {notificationStatus === "completed" ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              Notification Status
              <Badge
                className={
                  notificationStatus === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }
              >
                {notificationStatus === "completed" ? "Enquiries Stage Completed" : "Awaiting Completion Notification"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {notificationStatus === "completed"
                ? "The enquiries stage has been completed by the buyer's conveyancer"
                : "Waiting for notification that the enquiries stage has been completed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationStatus === "awaiting" ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 mx-auto text-amber-400 mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-amber-900 mb-2">Monitoring Enquiries Progress</h3>
                <p className="text-amber-700 mb-4">
                  Waiting for the buyer's conveyancer to complete the enquiries stage and proceed to mortgage offer.
                </p>
                <div className="bg-amber-100 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      You will be notified automatically when the stage is completed
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Completion Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-2">Enquiries Stage Completed Successfully</h4>
                      <p className="text-green-800 mb-3">
                        The buyer's conveyancer has completed all enquiries and is now proceeding to the mortgage offer
                        stage.
                      </p>

                      {completionData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                              {completionData.totalEnquiries || 0}
                            </div>
                            <div className="text-green-700">Total Enquiries</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                              {completionData.answeredEnquiries || 0}
                            </div>
                            <div className="text-green-700">Enquiries Answered</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                              {completionData.outstandingIssues || 0}
                            </div>
                            <div className="text-green-700">Outstanding Issues</div>
                          </div>
                        </div>
                      )}

                      {lastUpdate && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Completed on {lastUpdate.toLocaleDateString()} at {lastUpdate.toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Next Stage: Mortgage Offer</h4>
                      <p className="text-blue-800 text-sm">
                        The transaction is now moving to the mortgage offer stage where the buyer will submit their
                        formal mortgage application.
                      </p>
                    </div>
                    <Button onClick={handleViewNextStage} className="bg-blue-600 hover:bg-blue-700">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      View Mortgage Offer Stage
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Enquiries Stage Overview
            </CardTitle>
            <CardDescription>Monitor the progress of property enquiries and legal questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Stage Progress */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">4</div>
                  <div className="text-sm text-gray-600">Total Stages</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {notificationStatus === "completed" ? "1" : "0"}
                  </div>
                  <div className="text-sm text-green-600">Current Stage</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {notificationStatus === "completed" ? "0" : "1"}
                  </div>
                  <div className="text-sm text-amber-600">Remaining</div>
                </div>
              </div>

              {/* Key Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Enquiries Stage Information</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Legal enquiries are raised by the buyer's conveyancer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Seller's conveyancer provides responses to all enquiries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>All parties review and approve the enquiry responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>Transaction proceeds to mortgage offer stage upon completion</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Enquiries Documents
              {receivedDocuments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {receivedDocuments.length} document{receivedDocuments.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Documents related to the enquiries stage</CardDescription>
          </CardHeader>
          <CardContent>
            {receivedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
                <p className="text-gray-600">Enquiries documents will appear here when shared by the conveyancers.</p>
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
                          <Badge className="bg-blue-100 text-blue-800">{document.status}</Badge>
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
                            <FileText className="h-3 w-3" />
                            Size: {(document.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            Downloads: {document.downloadCount}
                          </div>
                        </div>

                        {document.coverMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-900 mb-1">Cover Message:</p>
                                <p className="text-sm text-blue-800">{document.coverMessage}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from the enquiries stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {updates
                .filter((update) => update.stage === "enquiries")
                .slice(0, 5)
                .map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {update.type === "stage_completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : update.type === "document_uploaded" ? (
                        <FileText className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{update.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {update.role.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{update.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(update.createdAt).toLocaleDateString()} at{" "}
                        {new Date(update.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

              {updates.filter((update) => update.stage === "enquiries").length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-600">Activity updates will appear here as the enquiries stage progresses.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
