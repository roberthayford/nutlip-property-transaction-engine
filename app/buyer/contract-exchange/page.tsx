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
          exchangedAt: exchangeUpdate.data?.exchangedAt || exchangeUpdate.createdAt,
          exchangeDate: exchangeUpdate.data?.exchangeDate || new Date().toISOString(),
          completionDate: exchangeUpdate.data?.completionDate,
          contractPrice: exchangeUpdate.data?.contractPrice || "£450,000",
          deposit: exchangeUpdate.data?.deposit || "£45,000 (10%)",
          status: "completed",
          nextStage: "Transaction Fee",
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
              <h3 className="font-semibold text-blue-800">Your Conveyancer is Handling This</h3>
              <p className="text-sm text-blue-700">
                Your conveyancer is conducting the formal contract exchange with the seller's conveyancer. This is a
                legal process that commits both parties to the transaction. You will be notified when it's completed.
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
            <CardDescription>Current status of your contract exchange</CardDescription>
          </CardHeader>
          <CardContent>
            {exchangeStatus === "awaiting" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <div className="font-medium">Awaiting Contract Exchange</div>
                  <div className="text-sm text-grey-500">
                    Your conveyancer is working with the seller's conveyancer to exchange contracts. You will be
                    notified automatically when this is completed.
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Exchange in Progress
                </Badge>
              </div>
            )}

            {exchangeStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-grey-300 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Contracts Exchanged Successfully!</div>
                    <div className="text-sm text-grey-500">
                      Congratulations! The contracts have been exchanged. You are now legally committed to purchase the
                      property and the seller is committed to sell it to you.
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Exchanged
                  </Badge>
                </div>

                {/* Contract Exchange Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-grey-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-grey-500">Exchange Date</p>
                    <p className="font-semibold">
                      {exchangeData.exchangeDate
                        ? formatExchangeDate(exchangeData.exchangeDate)
                        : "Today, April 12, 2024"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Completion Date</p>
                    <p className="font-semibold">
                      {exchangeData.completionDate ? formatExchangeDate(exchangeData.completionDate) : "April 26, 2024"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Purchase Price</p>
                    <p className="font-semibold">{exchangeData.contractPrice || "£450,000"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Deposit Paid</p>
                    <p className="font-semibold">{exchangeData.deposit || "£45,000 (10%)"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Exchanged At</p>
                    <p className="font-semibold">
                      {exchangeData.exchangedAt ? formatDate(exchangeData.exchangedAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Next Stage</p>
                    <p className="font-semibold">{exchangeData.nextStage || "Completion"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-1">
          {/* What This Means for You */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                What This Means for You
              </CardTitle>
              <CardDescription>Understanding the contract exchange process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exchangeStatus === "awaiting" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-800">While You Wait</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Your conveyancer is handling all legal aspects of the exchange</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ensure your mortgage funds are ready for completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Start planning your move and arrange removals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Arrange buildings insurance to start from exchange</span>
                    </li>
                  </ul>
                </div>
              )}

              {exchangeStatus === "completed" && (
                <div className="p-4 bg-green-50 border border-grey-300 rounded-lg">
                  <h4 className="font-medium mb-2 text-green-800">Now That Contracts Are Exchanged</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>You are legally committed to purchase the property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>The seller is legally committed to sell to you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Your deposit is now held by the seller's conveyancer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Completion must happen on the agreed date</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium mb-2 text-yellow-800">Important to Remember</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {exchangeStatus === "completed"
                        ? "You could lose your deposit if you fail to complete without valid reason"
                        : "Once exchanged, you will be legally bound to complete the purchase"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {exchangeStatus === "completed"
                        ? "Completion must happen on the agreed date or penalty interest applies"
                        : "Your deposit will be at risk once contracts are exchanged"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Buildings insurance should be in place from exchange date</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {exchangeStatus === "completed"
                    ? "Contracts exchanged successfully - completion preparations can now begin"
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
                      Awaiting Exchange
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
                    What Happens at Exchange
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Conveyancers exchange identical contracts</li>
                    <li>• Both parties become legally bound</li>
                    <li>• Completion date is fixed</li>
                    <li>• Deposit is transferred to seller's conveyancer</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    After Exchange
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Final mortgage arrangements</li>
                    <li>• Completion statement preparation</li>
                    <li>• Moving arrangements</li>
                    <li>• Key collection on completion day</li>
                  </ul>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg ${
                  exchangeStatus === "completed" ? "bg-green-50 border-grey-300" : "bg-grey-50"
                }`}
              >
                <h4 className="font-semibold mb-2">Current Status</h4>
                <p className="text-sm">
                  {exchangeStatus === "completed"
                    ? "✅ Contracts have been exchanged successfully. You are now legally committed to purchase the property and can begin final preparations for completion."
                    : "⏳ Your conveyancer is handling the exchange process with the seller's conveyancer. You will be notified when contracts are exchanged."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
