"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, AlertTriangle, Users, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

interface RepliesToRequisitionsData {
  completedBy?: string
  completedAt?: string
  totalRequisitions?: number
  repliedRequisitions?: number
  outstandingRequisitions?: number
  status?: string
  nextStage?: string
  completionDate?: string
  urgentItems?: string[]
}

export default function EstateAgentRepliesToRequisitionsPage() {
  const { updates } = useRealTime()
  const [requisitionsStatus, setRequisitionsStatus] = useState<"awaiting" | "completed">("awaiting")
  const [requisitionsData, setRequisitionsData] = useState<RepliesToRequisitionsData>({})

  useEffect(() => {
    // Listen for replies to requisitions updates
    const requisitionsUpdate = updates.find(
      (update) => update.stage === "replies-to-requisitions" && update.type === "stage_completed",
    )

    if (requisitionsUpdate?.data?.repliesToRequisitions) {
      const requisitionsInfo = requisitionsUpdate.data.repliesToRequisitions
      setRequisitionsData(requisitionsInfo)

      if (requisitionsInfo.status === "completed") {
        setRequisitionsStatus("completed")
      }
    }
  }, [updates])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getProgressPercentage = () => {
    const total = requisitionsData.totalRequisitions || 6
    const replied = requisitionsData.repliedRequisitions || 0
    return Math.round((replied / total) * 100)
  }

  return (
    <TransactionLayout
      currentStage="replies-to-requisitions"
      userRole="estate-agent"
      title="Replies to Requisitions - Estate Agent View"
      description="Monitor completion requisitions and responses between conveyancers"
    >
      <div className="space-y-6">
        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Conveyancer Completion Process</div>
              <div className="text-sm text-gray-600">
                The conveyancers are handling final completion requisitions and responses. This is the final legal step
                before completion. You will be notified of progress and any issues that may affect the completion
                timeline.
              </div>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Requisitions Status
            </CardTitle>
            <CardDescription>Current status of completion requisitions and responses</CardDescription>
          </CardHeader>
          <CardContent>
            {requisitionsStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Monitoring Requisitions Progress</div>
                  <div className="text-sm text-gray-600">
                    The conveyancers are exchanging completion requisitions and responses. You will be notified
                    automatically when all requisitions are resolved.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {getProgressPercentage()}% Complete
                </Badge>
              </div>
            )}

            {requisitionsStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">All Requisitions Resolved</div>
                    <div className="text-sm text-gray-600">
                      All completion requisitions have been answered and the transaction is ready for completion.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                {/* Requisitions Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed By</p>
                    <p className="font-semibold">{requisitionsData.completedBy || "Both Conveyancers"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requisitions</p>
                    <p className="font-semibold">{requisitionsData.totalRequisitions || 6} Items</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="font-semibold">
                      {requisitionsData.completedAt ? formatDate(requisitionsData.completedAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Stage</p>
                    <p className="font-semibold">{requisitionsData.nextStage || "Completion"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estate Agent Monitoring Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Estate Agent Monitoring Role
            </CardTitle>
            <CardDescription>Your role during the replies to requisitions stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor progress and stay informed of any completion issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Coordinate key handover arrangements for completion day</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensure property is ready for vacant possession</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Facilitate final property inspection if required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain communication with buyer and seller about completion timeline</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Potential Issues to Watch For</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Delays in requisition responses that could affect completion date</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Outstanding mortgage discharge issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Final meter readings or utility transfer problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Key collection or property access complications</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What Happens Next</h4>
              <p className="text-sm text-blue-700">
                {requisitionsStatus === "completed"
                  ? "All requisitions have been resolved. The transaction will now proceed to completion. Ensure all practical arrangements are in place for completion day."
                  : "The conveyancers will continue to exchange requisitions and responses until all completion matters are resolved. You'll be notified of key milestones and any issues that may affect the completion timeline."}
              </p>
            </div>

            {/* Completion Timeline */}
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Completion Timeline
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Target Completion Date:</span>
                  <span className="font-semibold">{requisitionsData.completionDate || "April 26, 2024"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Time:</span>
                  <span className="font-semibold">2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Days Remaining:</span>
                  <span className="font-semibold text-green-600">2 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Requisitions Deadline:</span>
                  <span className="font-semibold">April 25, 2024</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {requisitionsStatus === "completed"
                  ? "All requisitions resolved - ready for completion"
                  : "You will be automatically notified when all requisitions are resolved"}
              </p>
              <Badge variant="outline" className="px-4 py-2">
                {requisitionsStatus === "completed" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ready for Completion
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Awaiting Requisition Resolution
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
