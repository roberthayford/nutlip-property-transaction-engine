"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, AlertTriangle, FileText, PoundSterling, Calendar, CreditCard } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"

interface MortgageOfferData {
  lenderName?: string
  loanAmount?: string
  interestRate?: string
  rateType?: string
  ratePeriod?: string
  offerValidUntil?: string
  monthlyPayment?: string
  propertyValuation?: string
  ltvRatio?: string
  specialConditions?: string
  buildingInsuranceRequired?: boolean
  lifeInsuranceRequired?: boolean
  additionalNotes?: string
  submittedAt?: string
  status?: string
  reason?: string
}

export default function SellerConveyancerMortgageOfferPage() {
  const { updates } = useRealTime()
  const [notes, setNotes] = useState("")
  const [mortgageData, setMortgageData] = useState<MortgageOfferData>({})
  const [mortgageStatus, setMortgageStatus] = useState<"awaiting" | "completed" | "not_applicable">("awaiting")

  const [actionItems, setActionItems] = useState([
    {
      task: "Notify client of mortgage offer receipt",
      completed: false,
      priority: "high" as const,
    },
    {
      task: "Review mortgage offer conditions",
      completed: false,
      priority: "high" as const,
    },
    {
      task: "Coordinate with buyer's conveyancer on completion date",
      completed: false,
      priority: "medium" as const,
      notes: "Need to confirm buyer's preferred completion date and check diary availability",
    },
    {
      task: "Prepare completion statement",
      completed: false,
      priority: "medium" as const,
    },
    {
      task: "Arrange final searches and enquiries",
      completed: false,
      priority: "low" as const,
    },
  ])
  const [completingItems, setCompletingItems] = useState<number[]>([])

  // Listen for mortgage offer updates from buyer conveyancer
  useEffect(() => {
    const mortgageOfferUpdate = updates.find(
      (update) =>
        update.type === "stage_completed" &&
        update.stage === "mortgage-offer" &&
        update.role === "buyer-conveyancer" &&
        update.data?.mortgageOffer,
    )

    if (mortgageOfferUpdate) {
      const offerData = mortgageOfferUpdate.data.mortgageOffer
      setMortgageData(offerData)

      if (offerData.status === "completed") {
        setMortgageStatus("completed")
        // Auto-complete first two action items when mortgage offer received
        setActionItems((prev) =>
          prev.map((item, index) =>
            index < 2 ? { ...item, completed: true, completedAt: new Date().toISOString() } : item,
          ),
        )
      } else if (offerData.status === "not_applicable") {
        setMortgageStatus("not_applicable")
        // Update action items for cash purchase
        setActionItems([
          {
            task: "Notify client that no mortgage is required (cash purchase)",
            completed: true,
            completedAt: new Date().toISOString(),
            priority: "high" as const,
          },
          {
            task: "Confirm proof of funds with buyer conveyancer",
            completed: false,
            priority: "high" as const,
          },
          {
            task: "Coordinate completion date for cash purchase",
            completed: false,
            priority: "medium" as const,
          },
          {
            task: "Prepare completion statement (no mortgage)",
            completed: false,
            priority: "medium" as const,
          },
          {
            task: "Arrange final searches and enquiries",
            completed: false,
            priority: "low" as const,
          },
        ])
      }
    }
  }, [updates])

  const completeActionItem = async (index: number) => {
    setCompletingItems((prev) => [...prev, index])

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setActionItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, completed: true, completedAt: new Date().toISOString() } : item)),
    )

    setCompletingItems((prev) => prev.filter((i) => i !== index))
  }

  const uncompleteActionItem = (index: number) => {
    setActionItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, completed: false, completedAt: undefined } : item)),
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <TransactionLayout currentStage="mortgage-offer" userRole="seller-conveyancer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mortgage Offer Review</h1>
            <p className="text-muted-foreground">Monitor and respond to the buyer's mortgage offer process</p>
          </div>
        </div>

        {/* Mortgage Offer Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Mortgage Offer Status
            </CardTitle>
            <CardDescription>Current status of the buyer's mortgage offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mortgageStatus === "awaiting" && (
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-medium">Awaiting Mortgage Offer</div>
                    <div className="text-sm text-gray-600">
                      Waiting for buyer conveyancer to submit mortgage offer details
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Pending
                </Badge>
              </div>
            )}

            {mortgageStatus === "completed" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Mortgage Offer Received</div>
                      <div className="text-sm text-gray-600">
                        Formal offer received from {mortgageData.lenderName || "lender"}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PoundSterling className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Loan Amount</span>
                    </div>
                    <div className="text-lg font-bold">£{mortgageData.loanAmount || "0"}</div>
                    <div className="text-xs text-gray-600">
                      {mortgageData.ltvRatio ? `${mortgageData.ltvRatio}% LTV` : "LTV TBC"}
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Offer Valid Until</span>
                    </div>
                    <div className="text-lg font-bold">
                      {mortgageData.offerValidUntil
                        ? new Date(mortgageData.offerValidUntil).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "TBC"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {mortgageData.offerValidUntil
                        ? `${Math.ceil((new Date(mortgageData.offerValidUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                        : "Validity period TBC"}
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Lender</span>
                    </div>
                    <div className="text-lg font-bold">{mortgageData.lenderName || "Unknown"}</div>
                    <div className="text-xs text-gray-600">
                      {mortgageData.rateType
                        ? `${mortgageData.interestRate}% ${mortgageData.rateType}${mortgageData.ratePeriod ? ` (${mortgageData.ratePeriod})` : ""}`
                        : "Rate details TBC"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mortgageStatus === "not_applicable" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Mortgage Not Required</div>
                      <div className="text-sm text-gray-600">
                        This is a cash purchase. No mortgage offer is required for this transaction.
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Cash Purchase</Badge>
                </div>

                <div className="p-4 bg-gray-50 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Purchase Type</p>
                      <p className="text-lg font-bold">Cash Purchase</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Confirmed</p>
                      <p className="text-lg font-bold">
                        {mortgageData.submittedAt ? formatDate(mortgageData.submittedAt) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Benefits of Cash Purchase</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Faster completion timeline</li>
                    <li>• No mortgage conditions to satisfy</li>
                    <li>• Reduced risk of delays</li>
                    <li>• No lender requirements</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Special Conditions - Only show for mortgage offers */}
        {mortgageStatus === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle>Mortgage Offer Conditions</CardTitle>
              <CardDescription>Review any special conditions attached to the mortgage offer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Property Valuation</h4>
                    <Badge variant="default">Confirmed</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Property valuation of £{mortgageData.propertyValuation || "TBC"} accepted by{" "}
                    {mortgageData.lenderName || "lender"}.
                  </p>
                </div>

                {mortgageData.buildingInsuranceRequired && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Building Insurance Required</h4>
                      <Badge variant="secondary">Action Required</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Buildings insurance must be in place from completion date.</p>
                  </div>
                )}

                {mortgageData.lifeInsuranceRequired && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Life Insurance Required</h4>
                      <Badge variant="secondary">Action Required</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Life insurance policy required by lender.</p>
                  </div>
                )}

                {mortgageData.specialConditions && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Additional Conditions</h4>
                      <Badge variant="secondary">Review Required</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{mortgageData.specialConditions}</p>
                  </div>
                )}

                {!mortgageData.buildingInsuranceRequired &&
                  !mortgageData.lifeInsuranceRequired &&
                  !mortgageData.specialConditions && (
                    <div className="border rounded-lg p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-gray-600">No special conditions attached to this mortgage offer</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Impact</CardTitle>
            <CardDescription>
              {mortgageStatus === "not_applicable"
                ? "How the cash purchase affects the conveyancing process"
                : "How the mortgage offer affects the conveyancing process"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mortgageStatus === "completed" && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">Positive Impact</div>
                      <div className="text-sm text-green-700">
                        Mortgage offer received within expected timeframe. No delays to completion date.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800">Documentation Required</div>
                      <div className="text-sm text-blue-700">
                        Lender's solicitor will require copy of contract and title documents before completion.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Timing Consideration</div>
                      <div className="text-sm text-yellow-700">
                        Mortgage offer valid until{" "}
                        {mortgageData.offerValidUntil
                          ? new Date(mortgageData.offerValidUntil).toLocaleDateString()
                          : "TBC"}
                        . Completion must occur before this date.
                      </div>
                    </div>
                  </div>
                </>
              )}

              {mortgageStatus === "not_applicable" && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">Accelerated Timeline</div>
                      <div className="text-sm text-green-700">
                        Cash purchase allows for faster completion as no mortgage conditions need to be satisfied.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800">Simplified Process</div>
                      <div className="text-sm text-blue-700">
                        No lender requirements or mortgage conditions to coordinate. Focus on standard conveyancing
                        process.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-800">Proof of Funds</div>
                      <div className="text-sm text-purple-700">
                        Ensure buyer conveyancer has provided adequate proof of funds for the cash purchase.
                      </div>
                    </div>
                  </div>
                </>
              )}

              {mortgageStatus === "awaiting" && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-800">Awaiting Information</div>
                    <div className="text-sm text-gray-700">
                      Transaction impact will be assessed once mortgage offer details are received.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>
                  {mortgageStatus === "not_applicable"
                    ? "Tasks to complete for cash purchase"
                    : "Tasks to complete following mortgage offer receipt"}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Progress</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((actionItems.filter((item) => item.completed).length / actionItems.length) * 100)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(actionItems.filter((item) => item.completed).length / actionItems.length) * 100}%`,
                }}
              ></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <span className={`text-sm ${item.completed ? "text-gray-900 line-through" : "text-gray-600"}`}>
                      {item.task}
                    </span>
                    {item.completed && item.completedAt && (
                      <div className="text-xs text-gray-500 mt-1">Completed on {formatDate(item.completedAt)}</div>
                    )}
                    {item.priority && (
                      <Badge
                        variant={
                          item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs mt-1"
                      >
                        {item.priority} priority
                      </Badge>
                    )}
                  </div>
                  {!item.completed ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={completingItems.includes(index)}
                      onClick={() => completeActionItem(index)}
                    >
                      {completingItems.includes(index) ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        "Complete"
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => uncompleteActionItem(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Undo
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Completion Summary */}
            {actionItems.every((item) => item.completed) && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800">All Action Items Completed!</div>
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {mortgageStatus === "not_applicable"
                    ? "Great work! All cash purchase related tasks have been completed. You can now proceed to the next stage."
                    : "Great work! All mortgage offer related tasks have been completed. You can now proceed to the next stage."}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Case Notes</CardTitle>
            <CardDescription>
              {mortgageStatus === "not_applicable"
                ? "Record any important notes regarding the cash purchase"
                : "Record any important notes regarding the mortgage offer"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder={
                  mortgageStatus === "not_applicable"
                    ? "Record any important observations about the cash purchase or proof of funds..."
                    : "Record any important observations about the mortgage offer or conditions..."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button>Save Notes</Button>
          </CardContent>
        </Card>

        {/* Important Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {mortgageStatus === "completed" && (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-medium text-amber-800">Offer Validity</p>
                    <p className="text-amber-700">
                      Monitor the mortgage offer expiry date and ensure completion occurs before this date.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">Lender Requirements</p>
                    <p className="text-blue-700">
                      Ensure all lender conditions are satisfied before completion to avoid last-minute delays.
                    </p>
                  </div>
                </>
              )}

              {mortgageStatus === "not_applicable" && (
                <>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800">Cash Purchase Benefits</p>
                    <p className="text-green-700">
                      Take advantage of the faster timeline possible with cash purchases while ensuring all legal
                      requirements are met.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">Proof of Funds</p>
                    <p className="text-blue-700">
                      Ensure adequate proof of funds documentation is obtained and verified before proceeding to
                      completion.
                    </p>
                  </div>
                </>
              )}

              {mortgageStatus === "awaiting" && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-800">Monitoring Required</p>
                  <p className="text-gray-700">
                    Continue monitoring for updates from the buyer conveyancer regarding mortgage offer status.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
