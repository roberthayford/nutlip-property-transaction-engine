"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

interface CompletionDateData {
  completedBy?: string
  completedAt?: string
  agreedDate?: string
  proposedBy?: string
  status?: string
  nextStage?: string
}

export default function EstateAgentCompletionDatePage() {
  const { updates } = useRealTime()
  const [completionStatus, setCompletionStatus] = useState<"awaiting" | "completed">("awaiting")
  const [completionData, setCompletionData] = useState<CompletionDateData>({})

  useEffect(() => {
    // Listen for completion date updates
    const completionUpdate = updates.find(
      (update) =>
        update.stage === "completion-date" &&
        (update.type === "stage_completed" || update.type === "completion_date_confirmed"),
    )

    if (completionUpdate) {
      if (completionUpdate.type === "completion_date_confirmed") {
        // Handle completion date confirmed updates
        const updateData = {
          completedBy: completionUpdate.data?.confirmedBy || completionUpdate.role,
          completedAt: completionUpdate.timestamp,
          agreedDate: completionUpdate.data?.date,
          proposedBy: completionUpdate.data?.proposedBy || completionUpdate.role,
          status: "completed",
          nextStage: "Contract Exchange",
        }
        setCompletionData(updateData)
        setCompletionStatus("completed")
      } else if (completionUpdate.data?.completionDate) {
        // Handle stage completed updates
        const completionInfo = completionUpdate.data.completionDate
        setCompletionData(completionInfo)
        if (completionInfo.status === "completed") {
          setCompletionStatus("completed")
        }
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

  const formatCompletionDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <TransactionLayout
      currentStage="completion-date"
      userRole="estate-agent"
      title="Completion Date - Estate Agent View"
      description="Monitor the completion date coordination process and receive notifications when agreed"
    >
      <div className="space-y-6">
        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Conveyancer Coordination Stage</div>
              <div className="text-sm text-gray-600">
                This stage is handled by the buyer and seller conveyancers. You will be notified when they agree on a
                completion date.
              </div>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Status
            </CardTitle>
            <CardDescription>Current status of the completion date coordination</CardDescription>
          </CardHeader>
          <CardContent>
            {completionStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Date Agreement</div>
                  <div className="text-sm text-gray-600">
                    The conveyancers are coordinating to agree on a completion date. You will be notified automatically
                    when agreed.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Monitoring Progress
                </Badge>
              </div>
            )}

            {completionStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Completion Date Agreed</div>
                    <div className="text-sm text-gray-600">
                      The conveyancers have agreed on a completion date and the transaction can proceed.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                {/* Completion Date Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agreed Date</p>
                    <p className="font-semibold">
                      {completionData.agreedDate
                        ? formatCompletionDate(completionData.agreedDate)
                        : "Friday, April 26, 2024"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmed By</p>
                    <p className="font-semibold">
                      {completionData.completedBy === "buyer-conveyancer"
                        ? "Buyer Conveyancer"
                        : completionData.completedBy === "seller-conveyancer"
                          ? "Seller Conveyancer"
                          : completionData.completedBy || "Buyer Conveyancer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agreed On</p>
                    <p className="font-semibold">
                      {completionData.completedAt ? formatDate(completionData.completedAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Stage</p>
                    <p className="font-semibold">{completionData.nextStage || "Contract Exchange"}</p>
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
            <CardDescription>Your role during the completion date coordination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor progress and stay informed of the agreed completion date</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Prepare for completion day arrangements and key handover</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Coordinate with buyer and seller for completion day logistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensure property is ready for handover on the agreed date</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Potential Issues to Watch For</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Delays in date agreement that could affect the transaction timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Conflicts between buyer and seller preferred dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Mortgage offer expiry dates affecting completion timing</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What Happens Next</h4>
              <p className="text-sm text-blue-700">
                {completionStatus === "completed"
                  ? "The completion date has been agreed. You can now prepare for completion day arrangements and coordinate the final handover process."
                  : "The conveyancers will coordinate to agree on a suitable completion date. You'll be notified once they reach agreement and can then prepare for completion day logistics."}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {completionStatus === "completed"
                  ? "Completion date coordination completed successfully"
                  : "You will be automatically notified when the completion date is agreed"}
              </p>
              <Badge variant="outline" className="px-4 py-2">
                {completionStatus === "completed" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Date Agreed
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Awaiting Conveyancer Agreement
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
