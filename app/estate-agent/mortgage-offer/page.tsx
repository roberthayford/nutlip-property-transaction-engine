"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

interface MortgageOfferData {
  lenderName?: string
  loanAmount?: string
  interestRate?: string
  rateType?: string
  submittedAt?: string
  status?: string
  reason?: string
}

export default function EstateAgentMortgageOfferPage() {
  const { updates } = useRealTime()
  const [mortgageStatus, setMortgageStatus] = useState<"awaiting" | "completed" | "not_applicable">("awaiting")
  const [mortgageData, setMortgageData] = useState<MortgageOfferData>({})

  useEffect(() => {
    // Listen for mortgage offer updates
    const mortgageUpdate = updates.find(
      (update) => update.stage === "mortgage-offer" && update.type === "stage_completed",
    )

    if (mortgageUpdate?.data?.mortgageOffer) {
      const offerData = mortgageUpdate.data.mortgageOffer
      setMortgageData(offerData)

      if (offerData.status === "completed") {
        setMortgageStatus("completed")
      } else if (offerData.status === "not_applicable") {
        setMortgageStatus("not_applicable")
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
      currentStage="mortgage-offer"
      userRole="estate-agent"
      title="Mortgage Offer - Estate Agent View"
      description="Monitor the mortgage offer process and receive notifications when completed"
    >
      <div className="space-y-6">
        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Conveyancer & Buyer Stage</div>
              <div className="text-sm text-gray-600">
                The buyer conveyancer is handling the mortgage offer process. You will be automatically notified when
                complete.
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
            <CardDescription>Current status of the mortgage offer process</CardDescription>
          </CardHeader>
          <CardContent>
            {mortgageStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Completion Notification</div>
                  <div className="text-sm text-gray-600">
                    The buyer conveyancer is processing the mortgage offer. You will be notified automatically when
                    complete.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Monitoring Progress
                </Badge>
              </div>
            )}

            {mortgageStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Process Completed</div>
                    <div className="text-sm text-gray-600">
                      Mortgage offer has been processed and submitted to the seller conveyancer.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>

                {/* Mortgage Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lender</p>
                    <p className="font-semibold">{mortgageData.lenderName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Loan Amount</p>
                    <p className="font-semibold">£{mortgageData.loanAmount || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Interest Rate</p>
                    <p className="font-semibold">
                      {mortgageData.interestRate}% ({mortgageData.rateType})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="font-semibold">
                      {mortgageData.submittedAt ? formatDate(mortgageData.submittedAt) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {mortgageStatus === "not_applicable" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">Mortgage Not Required</div>
                    <div className="text-sm text-gray-600">
                      This is a cash purchase. No mortgage offer is required for this transaction.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Cash Purchase
                  </Badge>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Purchase Type</p>
                    <p className="font-semibold">Cash Purchase</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="font-semibold">
                      {mortgageData.submittedAt ? formatDate(mortgageData.submittedAt) : "N/A"}
                    </p>
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
            <CardDescription>Your role during the mortgage offer stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Responsibilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor progress and be available for any queries from conveyancers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep sellers informed of progress when appropriate</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be prepared to assist with any property-related queries from lenders</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Potential Issues to Watch For</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Delays in mortgage offer that could affect exchange timelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Valuation issues that might require property information</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Special conditions that might affect the sale terms</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
