"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

interface DraftContractData {
  completedBy?: string
  completedAt?: string
  contractType?: string
  specialConditions?: string[]
  status?: string
  nextStage?: string
}

export default function EstateAgentDraftContractPage() {
  const { updates } = useRealTime()
  const [contractStatus, setContractStatus] = useState<"awaiting" | "completed">("awaiting")
  const [contractData, setContractData] = useState<DraftContractData>({})

  useEffect(() => {
    // Listen for draft contract updates
    const contractUpdate = updates.find(
      (update) => update.stage === "draft-contract" && update.type === "stage_completed",
    )

    if (contractUpdate?.data?.draftContract) {
      const contractInfo = contractUpdate.data.draftContract
      setContractData(contractInfo)

      if (contractInfo.status === "completed") {
        setContractStatus("completed")
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

  return (
    <TransactionLayout
      currentStage="draft-contract"
      userRole="estate-agent"
      title="Draft Contract - Estate Agent View"
      description="Monitor the draft contract preparation process and receive notifications when completed"
    >
      <div className="space-y-6">
        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Conveyancer Stage</div>
              <div className="text-sm text-grey-600">
                This stage is handled by the buyer and seller conveyancers. You will be notified of progress and any
                issues that may affect the sale.
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
            <CardDescription>Current status of the draft contract preparation</CardDescription>
          </CardHeader>
          <CardContent>
            {contractStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Completion Notification</div>
                  <div className="text-sm text-grey-600">
                    The conveyancers are preparing the draft contract. You will be notified automatically when complete.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Monitoring Progress
                </Badge>
              </div>
            )}

            {contractStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Draft Contract Completed</div>
                    <div className="text-sm text-grey-600">
                      The draft contract has been prepared and is ready for the next stage of the transaction.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                {/* Contract Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-grey-600">Completed By</p>
                    <p className="font-semibold">{contractData.completedBy || "Seller Conveyancer"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-600">Contract Type</p>
                    <p className="font-semibold">{contractData.contractType || "Standard Residential"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-600">Completed</p>
                    <p className="font-semibold">
                      {contractData.completedAt ? formatDate(contractData.completedAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-600">Next Stage</p>
                    <p className="font-semibold">{contractData.nextStage || "Searches & Survey"}</p>
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
            <CardDescription>Your role during the draft contract stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-grey-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-grey-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor progress and stay informed of any issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be available to clarify property details if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain communication with buyer and seller</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Assist with any queries about the property or sale terms</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Potential Issues to Watch For</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Delays in contract preparation that could affect timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Special conditions that might require property information</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Title issues that might need estate agent input</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What Happens Next</h4>
              <p className="text-sm text-blue-700">
                {contractStatus === "completed"
                  ? "The draft contract is complete. The transaction will now proceed to the searches and survey stage."
                  : "The conveyancers will complete the draft contract and begin the legal process. You'll be notified of key milestones and any issues that may affect the sale timeline."}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {contractStatus === "completed"
                  ? "Draft contract stage completed successfully"
                  : "You will be automatically notified when this stage is complete"}
              </p>
              <Badge variant="outline" className="px-4 py-2">
                {contractStatus === "completed" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Stage Completed
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Awaiting Conveyancer Completion
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
