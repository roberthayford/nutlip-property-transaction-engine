"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, Eye, AlertTriangle, Users, Handshake, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TransactionLayout from "@/components/transaction-layout"
import { useRealTime } from "@/contexts/real-time-context"

interface ContractExchangeData {
  exchangedBy?: string
  exchangedAt?: string
  exchangeDate?: string
  completionDate?: string
  contractPrice?: string
  deposit?: string
  status?: string
  nextStage?: string
}

export default function BuyerContractExchangePage() {
  const { updates } = useRealTime()
  const [exchangeStatus, setExchangeStatus] = useState<"awaiting" | "completed">("awaiting")
  const [exchangeData, setExchangeData] = useState<ContractExchangeData>({})

  useEffect(() => {
    // Listen for contract exchange updates
    const exchangeUpdate = updates.find(
      (update) =>
        update.stage === "contract-exchange" &&
        (update.type === "stage_completed" || update.type === "contract_exchanged"),
    )

    if (exchangeUpdate) {
      if (exchangeUpdate.type === "contract_exchanged") {
        // Handle contract exchanged updates
        const updateData = {
          exchangedBy: exchangeUpdate.data?.exchangedBy || exchangeUpdate.role,
          exchangedAt: exchangeUpdate.timestamp,
          exchangeDate: exchangeUpdate.data?.exchangeDate || new Date().toISOString(),
          completionDate: exchangeUpdate.data?.completionDate,
          contractPrice: exchangeUpdate.data?.contractPrice || "£450,000",
          deposit: exchangeUpdate.data?.deposit || "£45,000 (10%)",
          status: "completed",
          nextStage: "Completion",
        }
        setExchangeData(updateData)
        setExchangeStatus("completed")
      } else if (exchangeUpdate.data?.contractExchange) {
        // Handle stage completed updates
        const exchangeInfo = exchangeUpdate.data.contractExchange
        setExchangeData(exchangeInfo)
        if (exchangeInfo.status === "completed") {
          setExchangeStatus("completed")
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

  const formatExchangeDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <TransactionLayout currentStage="contract-exchange" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Handshake className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Contract Exchange - Buyer View</h1>
            <p className="text-muted-foreground">Your conveyancer is handling the legal contract exchange process.</p>
          </div>
        </div>

        {/* Conveyancer Stage Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800">Legal Exchange Process</h3>
              <p className="text-sm text-blue-700">
                Your conveyancer is working with the seller's conveyancer to formally exchange contracts. This will
                legally commit both parties to the transaction. You will be notified when the exchange is completed.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Exchange Notification Status
            </CardTitle>
            <CardDescription>Current status of the contract exchange process</CardDescription>
          </CardHeader>
          <CardContent>
            {exchangeStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Contract Exchange</div>
                  <div className="text-sm text-gray-600">
                    Your conveyancer is conducting the formal exchange process with the seller's conveyancer. You will
                    be notified automatically when contracts are exchanged.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Exchange in Progress
                </Badge>
              </div>
            )}

            {exchangeStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Contracts Exchanged Successfully</div>
                    <div className="text-sm text-gray-600">
                      The contracts have been formally exchanged. You are now legally committed to purchase the property
                      and the seller is legally committed to sell it to you.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Exchanged
                  </Badge>
                </div>

                {/* Contract Exchange Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exchange Date</p>
                    <p className="font-semibold">
                      {exchangeData.exchangeDate
                        ? formatExchangeDate(exchangeData.exchangeDate)
                        : "Today, April 12, 2024"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Date</p>
                    <p className="font-semibold">
                      {exchangeData.completionDate ? formatExchangeDate(exchangeData.completionDate) : "April 26, 2024"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Purchase Price</p>
                    <p className="font-semibold">{exchangeData.contractPrice || "£450,000"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Your Deposit</p>
                    <p className="font-semibold">{exchangeData.deposit || "£45,000 (10%)"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exchanged At</p>
                    <p className="font-semibold">
                      {exchangeData.exchangedAt ? formatDate(exchangeData.exchangedAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Stage</p>
                    <p className="font-semibold">{exchangeData.nextStage || "Completion"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Buyer Monitoring Role */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Your Role During Contract Exchange
              </CardTitle>
              <CardDescription>What you need to know about the contract exchange process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">What's Happening Now</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Your conveyancer is coordinating with the seller's conveyancer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Final pre-exchange checks are being completed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Your deposit is being prepared for transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>The formal exchange call will take place between conveyancers</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium mb-2 text-yellow-800">Important Reminders</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Ensure your mortgage offer remains valid and funds are available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Your deposit will become non-refundable after exchange</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>You will be legally bound to complete the purchase</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800">What Happens Next</h4>
                <p className="text-sm text-blue-700">
                  {exchangeStatus === "completed"
                    ? "Congratulations! Contracts have been exchanged successfully. You are now legally committed to purchase the property. Your conveyancer will begin final completion preparations and coordinate with your mortgage lender for the final drawdown."
                    : "Your conveyancer will complete the formal exchange process with the seller's conveyancer. You'll be notified immediately when contracts are exchanged and can then prepare for completion day."}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {exchangeStatus === "completed"
                    ? "Contract exchange completed successfully - you're buying the property!"
                    : "You will be automatically notified when contracts are exchanged"}
                </p>
                <Badge variant="outline" className="px-4 py-2">
                  {exchangeStatus === "completed" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Contracts Exchanged
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Awaiting Exchange Completion
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Understanding Contract Exchange</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Legal Commitment
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• You are legally bound to purchase the property</li>
                    <li>• The seller is legally bound to sell to you</li>
                    <li>• Completion date becomes fixed and binding</li>
                    <li>• Your deposit becomes non-refundable</li>
                    <li>• Contract terms cannot be changed</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Next Steps
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Final mortgage drawdown will be arranged</li>
                    <li>• Completion statements will be prepared</li>
                    <li>• Final property preparations will begin</li>
                    <li>• Key handover arrangements will be made</li>
                    <li>• Moving arrangements can be finalized</li>
                  </ul>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg ${
                  exchangeStatus === "completed" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <h4
                  className={`font-semibold mb-2 ${
                    exchangeStatus === "completed" ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {exchangeStatus === "completed" ? "Congratulations!" : "Preparing for Exchange"}
                </h4>
                <ul
                  className={`text-sm space-y-1 ${exchangeStatus === "completed" ? "text-green-700" : "text-blue-700"}`}
                >
                  <li>
                    • {exchangeStatus === "completed" ? "You are now" : "You will soon be"} the legal owner-to-be of the
                    property
                  </li>
                  <li>
                    • {exchangeStatus === "completed" ? "Begin planning" : "Prepare to plan"} your move and completion
                    day
                  </li>
                  <li>
                    • {exchangeStatus === "completed" ? "Coordinate" : "Prepare to coordinate"} with your mortgage
                    lender for final funds
                  </li>
                  <li>
                    • {exchangeStatus === "completed" ? "Finalize" : "Prepare"} moving arrangements and utility
                    transfers
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {exchangeStatus === "completed"
                    ? "The property purchase is now legally binding - congratulations on your new home!"
                    : "You will be notified immediately when contracts are exchanged"}
                </p>
                <Badge variant="outline" className="px-4 py-2">
                  {exchangeStatus === "completed" ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  {exchangeStatus === "completed"
                    ? "Exchange Complete - Property Secured!"
                    : "Exchange Expected: Today 2:00 PM"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
