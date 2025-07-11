"use client"

import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reply, Clock, CheckCircle, Users, FileText, AlertTriangle, Calendar, Home, Key } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"

export default function BuyerRepliesToRequisitionsPage() {
  const { updates } = useRealTime()
  const [requisitionsStatus, setRequisitionsStatus] = useState<"awaiting" | "completed">("awaiting")
  const [requisitionsData, setRequisitionsData] = useState({
    status: "awaiting",
    requisitionsSent: 6,
    responsesReceived: 4,
    outstandingItems: 2,
    completionApproved: false,
    completionDate: "2024-04-26T14:00:00Z",
    lastUpdated: new Date().toISOString(),
    completedBy: "",
    completedAt: "",
    totalRequisitions: 6,
    repliedRequisitions: 4,
    nextStage: "Completion",
  })

  useEffect(() => {
    // Listen for replies to requisitions completion updates
    const requisitionsUpdate = updates.find(
      (update) => update.stage === "replies-to-requisitions" && update.type === "stage_completed",
    )

    if (requisitionsUpdate?.data?.repliesToRequisitions) {
      const requisitionsInfo = requisitionsUpdate.data.repliesToRequisitions
      setRequisitionsData((prev) => ({
        ...prev,
        ...requisitionsInfo,
        lastUpdated: requisitionsUpdate.createdAt,
      }))

      if (requisitionsInfo.status === "completed") {
        setRequisitionsStatus("completed")
      }
    }
  }, [updates])

  const isCompleted = requisitionsStatus === "completed"
  const completionDate = new Date(requisitionsData.completionDate)

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <TransactionLayout currentStage="replies-to-requisitions" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Reply className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Replies to Requisitions - Buyer View</h1>
            <p className="text-muted-foreground">
              Monitor completion requisitions and responses for your property purchase.
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800">Conveyancer Completion Process</h3>
              <p className="text-sm text-blue-700">
                Your conveyancer and the seller's conveyancer are handling final completion requisitions and responses.
                This is the final legal step before you receive your keys.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Requisitions Status
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isCompleted ? (
                  <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold text-amber-800">Awaiting Completion</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      Your conveyancers are finalizing completion requisitions and responses.
                      {requisitionsData.outstandingItems > 0 && (
                        <span className="block mt-1">{requisitionsData.outstandingItems} items still outstanding.</span>
                      )}
                    </p>
                    <div className="text-xs text-amber-600 mt-2">
                      Last updated: {formatDistanceToNow(new Date(requisitionsData.lastUpdated))} ago
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Requisitions Complete</span>
                      </div>
                      <p className="text-sm text-green-700">
                        All completion requisitions have been answered and approved. Your property purchase is ready for
                        completion.
                      </p>
                      <div className="text-xs text-green-600 mt-2">
                        Completed: {formatDistanceToNow(new Date(requisitionsData.lastUpdated))} ago
                      </div>
                    </div>

                    {/* Completion Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-grey-600">Completed By</p>
                        <p className="font-semibold">{requisitionsData.completedBy || "Your Conveyancer"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-grey-600">Total Requisitions</p>
                        <p className="font-semibold">{requisitionsData.totalRequisitions} Items</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-grey-600">Completed</p>
                        <p className="font-semibold">
                          {requisitionsData.completedAt ? formatDate(requisitionsData.completedAt) : "Just now"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-grey-600">Next Stage</p>
                        <p className="font-semibold">{requisitionsData.nextStage || "Completion"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Role as Buyer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    During Requisitions
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Your conveyancer handles all legal requisitions</li>
                    <li>• No direct action required from you at this stage</li>
                    <li>• Stay available for any urgent queries</li>
                    <li>• Prepare for completion day arrangements</li>
                  </ul>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    Completion Preparation
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Arrange building insurance from completion date</li>
                    <li>• Organise utility account transfers</li>
                    <li>• Plan your moving arrangements</li>
                    <li>• Prepare final payment if required</li>
                  </ul>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Completion Day
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Collect keys from estate agent</li>
                    <li>• Conduct final property inspection</li>
                    <li>• Take meter readings for utilities</li>
                    <li>• Confirm property condition is satisfactory</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What to Watch For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {!isCompleted ? (
                  <>
                    <div className="p-3 border-l-4 border-amber-500 bg-amber-50">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div>
                          <span className="font-medium text-amber-800">Potential Delays</span>
                          <p className="text-sm text-amber-700 mt-1">
                            Outstanding requisitions could delay completion. Your conveyancer will keep you informed of
                            any issues.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-start space-x-2">
                        <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <span className="font-medium text-blue-800">Completion Date Changes</span>
                          <p className="text-sm text-blue-700 mt-1">
                            If requisitions take longer than expected, the completion date may need to be adjusted.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-green-800">Ready for Completion</span>
                        <p className="text-sm text-green-700 mt-1">
                          All requisitions have been resolved. Your property purchase is now ready for completion on the
                          scheduled date.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-green-800">Stay Prepared</span>
                      <p className="text-sm text-green-700 mt-1">
                        Keep your moving plans flexible and ensure all your completion preparations are ready.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>What Happens Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {!isCompleted ? (
                    <>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          If Requisitions Outstanding
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Conveyancers continue working on responses</li>
                          <li>• You'll be updated on any significant delays</li>
                          <li>• Completion may be postponed if necessary</li>
                          <li>• All parties will be notified of any changes</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          When Requisitions Complete
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Completion is confirmed for the agreed date</li>
                          <li>• Final arrangements are made with all parties</li>
                          <li>• You'll receive completion day instructions</li>
                          <li>• Keys will be available for collection</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border rounded-lg bg-green-50">
                        <h4 className="font-semibold mb-2 flex items-center text-green-800">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completion Confirmed
                        </h4>
                        <ul className="text-sm space-y-1 text-green-700">
                          <li>• All requisitions have been successfully resolved</li>
                          <li>• Completion date is confirmed as scheduled</li>
                          <li>• Final arrangements are being coordinated</li>
                          <li>• You'll receive completion day instructions soon</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h4 className="font-semibold mb-2 flex items-center text-blue-800">
                          <Key className="h-4 w-4 mr-2" />
                          Completion Day Preparation
                        </h4>
                        <ul className="text-sm space-y-1 text-blue-700">
                          <li>• Keys will be available for collection</li>
                          <li>• Final property inspection can be arranged</li>
                          <li>• Utility transfers will be activated</li>
                          <li>• Building insurance should be in place</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`p-4 border rounded-lg ${isCompleted ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
                >
                  <h4 className={`font-semibold mb-2 ${isCompleted ? "text-green-800" : "text-blue-800"}`}>
                    Your Next Steps
                  </h4>
                  <ul className={`text-sm space-y-1 ${isCompleted ? "text-green-700" : "text-blue-700"}`}>
                    <li>• Finalise your building insurance arrangements</li>
                    <li>• Confirm your moving company booking</li>
                    <li>• Set up utility account transfers</li>
                    <li>• Prepare any final payment required</li>
                    <li>• Stay available for urgent communications</li>
                    {isCompleted && <li>• Prepare for completion day - you're almost there!</li>}
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {isCompleted
                      ? "All requisitions complete - completion confirmed for the scheduled date"
                      : "You will be notified immediately when all requisitions are complete and completion is confirmed"}
                  </p>
                  <Badge variant={isCompleted ? "default" : "outline"} className="px-4 py-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {isCompleted ? "Completion Confirmed: " : "Target Completion: "}
                    {completionDate.toLocaleDateString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransactionLayout>
  )
}
