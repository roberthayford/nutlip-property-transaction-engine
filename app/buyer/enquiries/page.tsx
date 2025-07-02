"use client"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Bell, Info, Clock, CheckCircle, CreditCard } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { useEffect, useState } from "react"

export default function BuyerEnquiriesPage() {
  const { transactionState, updates } = useRealTime()
  const [enquiriesCompleted, setEnquiriesCompleted] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)
  const [mortgageOfferCompleted, setMortgageOfferCompleted] = useState(false)
  const [mortgageOfferData, setMortgageOfferData] = useState<any>(null)

  useEffect(() => {
    const unreadUpdates = updates.filter((update) => !update.read)

    // Check for enquiries completion
    const enquiriesUpdate = unreadUpdates.find(
      (update) =>
        update.type === "stage_completed" && update.data?.stage === "enquiries" && update.data?.status === "completed",
    )

    if (enquiriesUpdate && !enquiriesCompleted) {
      setEnquiriesCompleted(true)
      setCompletionData(enquiriesUpdate.data)

      // Mark as read
      const updatedUpdates = updates.map((u) => (u.id === enquiriesUpdate.id ? { ...u, read: true } : u))
      localStorage.setItem("realtime_updates", JSON.stringify(updatedUpdates))
    }

    // Check for mortgage offer completion
    const mortgageUpdate = unreadUpdates.find(
      (update) =>
        update.type === "stage_completed" && update.stage === "mortgage-offer" && update.role === "buyer-conveyancer",
    )

    if (mortgageUpdate && !mortgageOfferCompleted) {
      setMortgageOfferCompleted(true)
      setMortgageOfferData(mortgageUpdate.data)

      // Mark as read
      const updatedUpdates = updates.map((u) => (u.id === mortgageUpdate.id ? { ...u, read: true } : u))
      localStorage.setItem("realtime_updates", JSON.stringify(updatedUpdates))
    }
  }, [updates, enquiriesCompleted, mortgageOfferCompleted])

  return (
    <TransactionLayout currentStage="enquiries" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Enquiries - Buyer Monitoring</h1>
            <p className="text-muted-foreground">Monitor legal enquiry progress handled by your conveyancer.</p>
          </div>
        </div>

        {/* Role Information Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Conveyancer-Handled Stage</h3>
                <p className="text-blue-800 text-sm mb-3">
                  This stage is handled by your conveyancer and the seller's conveyancer. Legal enquiries are sent,
                  reviewed, and responded to by the legal teams to protect your purchase.
                </p>
                <div className="flex items-center space-x-2 text-blue-700 text-sm">
                  <Bell className="h-4 w-4" />
                  <span>
                    You will be automatically notified when this stage is completed or if any issues require your
                    attention.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automatic Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Automatic Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Awaiting Completion Notification */}
            <div className="p-4 border rounded-lg">
              {!enquiriesCompleted ? (
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-amber-800">Awaiting Completion Notification</h4>
                      <Badge className="bg-amber-100 text-amber-800">Monitoring</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your conveyancer is currently handling all legal enquiries. You will be automatically notified
                      when this stage is completed and the transaction can proceed to the mortgage offer stage.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Status:</span>
                        <span className="font-medium text-amber-700">Enquiries in Progress</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expected Timeline:</span>
                        <span className="font-medium">7-10 business days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Next Stage:</span>
                        <span className="font-medium">Mortgage Offer</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Enquiries Stage Completed</h4>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      All legal enquiries have been successfully resolved by your conveyancer. The transaction is now
                      ready to proceed to the mortgage offer stage.
                    </p>
                    {completionData && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Completion Date:</span>
                          <span className="font-medium text-green-700">
                            {new Date(completionData.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Enquiries:</span>
                          <span className="font-medium">{completionData.totalEnquiries || 12}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">All Answered:</span>
                          <span className="font-medium text-green-700">✓ Yes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next Stage:</span>
                          <span className="font-medium">{completionData.nextStage || "Mortgage Offer"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mortgage Offer Progress Notification */}
            {mortgageOfferCompleted && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Mortgage Offer Stage Completed</h4>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your mortgage offer has been successfully processed and submitted by your conveyancer. The
                      transaction is progressing to the completion date stage.
                    </p>
                    {mortgageOfferData && mortgageOfferData.mortgageOffer && (
                      <div className="space-y-2 text-sm">
                        {mortgageOfferData.mortgageOffer.status === "completed" ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Lender:</span>
                              <span className="font-medium text-green-700">
                                {mortgageOfferData.mortgageOffer.lenderName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Loan Amount:</span>
                              <span className="font-medium">£{mortgageOfferData.mortgageOffer.loanAmount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Interest Rate:</span>
                              <span className="font-medium">{mortgageOfferData.mortgageOffer.interestRate}%</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Purchase Type:</span>
                            <span className="font-medium text-blue-700">Cash Purchase</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Submitted:</span>
                          <span className="font-medium text-green-700">
                            {new Date(mortgageOfferData.mortgageOffer.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next Stage:</span>
                          <span className="font-medium">Completion Date</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage Completion */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800">Stage Completion</h4>
              <p className="text-sm text-muted-foreground mb-2">
                You will be notified immediately when all enquiries are resolved and your purchase protection is
                complete.
              </p>
              <div className="text-xs text-green-600">✓ Email and in-app notification enabled</div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">What Are Enquiries?</h4>
              <p className="text-sm text-blue-700 mb-2">
                Pre-contract enquiries are legal questions your conveyancer sends to the seller's conveyancer to uncover
                any issues that could affect your purchase decision or the property's value.
              </p>
              <p className="text-sm text-blue-700">
                <strong>Next Steps:</strong> Once all enquiries are satisfactorily answered, you will be notified and
                the transaction will progress to the mortgage offer stage.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
