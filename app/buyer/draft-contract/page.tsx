"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, AlertTriangle, Users, Shield } from "lucide-react"
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

export default function BuyerDraftContractPage() {
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
      userRole="buyer"
      title="Draft Contract - Buyer View"
      description="Monitor your conveyancer's preparation of the draft contract for your purchase"
    >
      <div className="space-y-6">
        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Conveyancer Stage</div>
              <div className="text-sm text-grey-500">
                This stage involves your conveyancer and the seller's conveyancer preparing the legal contract for your
                purchase. You will be notified of progress and any issues.
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
            <CardDescription>Current status of your draft contract preparation</CardDescription>
          </CardHeader>
          <CardContent>
            {contractStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Completion Notification</div>
                  <div className="text-sm text-grey-500">
                    Your conveyancer is preparing the draft contract for your purchase. You will be notified
                    automatically when complete.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Monitoring Progress
                </Badge>
              </div>
            )}

            {contractStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-grey-300 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Draft Contract Completed</div>
                    <div className="text-sm text-grey-500">
                      Your draft contract has been prepared and is ready for the next stage of your purchase.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                {/* Contract Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-grey-500">Prepared By</p>
                    <p className="font-semibold">{contractData.completedBy || "Your Conveyancer"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Contract Type</p>
                    <p className="font-semibold">{contractData.contractType || "Standard Residential Purchase"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Completed</p>
                    <p className="font-semibold">
                      {contractData.completedAt ? formatDate(contractData.completedAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Next Stage</p>
                    <p className="font-semibold">{contractData.nextStage || "Property Searches & Survey"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Role During Contract Preparation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Your Role During Contract Preparation
            </CardTitle>
            <CardDescription>What you need to do during the draft contract stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-grey-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-grey-500">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Stay available for any questions from your conveyancer</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review contract terms when provided by your conveyancer</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Provide any additional information requested</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-grey-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Confirm any special requirements for your purchase</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Things to Watch For</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Unusual contract terms that may need your approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Completion dates that don't align with your plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Special conditions that might affect your mortgage or insurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Any delays that could impact your moving plans</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-grey-300 rounded-lg">
              <h4 className="font-medium mb-2 text-green-800 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                How Your Conveyancer Protects You
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Reviews all contract terms to protect your interests</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensures all legal requirements are met for your purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Identifies any potential issues before you commit</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Negotiates terms that are favorable to you as the buyer</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What's Happening Now</h4>
              <p className="text-sm text-blue-700">
                {contractStatus === "completed"
                  ? "Your draft contract is complete. The next step will be property searches and surveys to ensure the property is suitable for your purchase."
                  : "Your conveyancer is working with the seller's conveyancer to prepare the legal contract for your purchase. They are ensuring all terms protect your interests and meet legal requirements."}
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
