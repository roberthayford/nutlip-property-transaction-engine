"use client"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Bell, Info, Clock, CheckCircle, Banknote } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"
import { useEffect, useState } from "react"

export default function BuyerMortgageOfferPage() {
  const { transactionState, updates } = useRealTime()
  const [mortgageOfferCompleted, setMortgageOfferCompleted] = useState(false)
  const [mortgageOfferData, setMortgageOfferData] = useState<any>(null)

  useEffect(() => {
    const unreadUpdates = updates.filter((update) => !update.read)
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
  }, [updates, mortgageOfferCompleted])

  return (
    <TransactionLayout currentStage="mortgage-offer" userRole="buyer">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mortgage Offer - Buyer View</h1>
            <p className="text-muted-foreground">Monitor your mortgage offer progress handled by your conveyancer.</p>
          </div>
        </div>

        {/* Conveyancer Stage Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Conveyancer-Handled Stage</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Your conveyancer is handling the mortgage offer submission and coordination with your lender. This
                  ensures all legal requirements are met and the offer is properly integrated into your transaction.
                </p>
                <div className="flex items-center space-x-2 text-blue-700 text-sm">
                  <Bell className="h-4 w-4" />
                  <span>
                    You will be automatically notified when your mortgage offer is processed and the transaction can
                    proceed to the next stage.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              {!mortgageOfferCompleted ? (
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-amber-800">Awaiting Mortgage Offer Processing</h4>
                      <Badge className="bg-amber-100 text-amber-800">Monitoring</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your conveyancer is currently processing your mortgage offer with the lender. You will be
                      automatically notified when this is completed and the transaction can proceed to the completion
                      date stage.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Status:</span>
                        <span className="font-medium text-amber-700">Mortgage Offer in Progress</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expected Timeline:</span>
                        <span className="font-medium">3-5 business days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Next Stage:</span>
                        <span className="font-medium">Completion Date</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  {mortgageOfferData?.mortgageOffer?.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <Banknote className="h-5 w-5 text-blue-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">
                        {mortgageOfferData?.mortgageOffer?.status === "completed"
                          ? "Mortgage Offer Completed"
                          : "Cash Purchase Confirmed"}
                      </h4>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {mortgageOfferData?.mortgageOffer?.status === "completed"
                        ? "Your mortgage offer has been successfully processed and submitted by your conveyancer. The transaction is now ready to proceed to the completion date stage."
                        : "Your cash purchase has been confirmed by your conveyancer. The transaction is now ready to proceed to the completion date stage."}
                    </p>
                    {mortgageOfferData?.mortgageOffer && (
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
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Offer Valid Until:</span>
                              <span className="font-medium">
                                {new Date(mortgageOfferData.mortgageOffer.validUntil).toLocaleDateString()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Purchase Type:</span>
                            <span className="font-medium text-blue-700">Cash Purchase</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Processed:</span>
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
              )}
            </div>
          </CardContent>
        </Card>

        {/* Your Role During Mortgage Offer */}
        <Card>
          <CardHeader>
            <CardTitle>Your Role During Mortgage Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">What's Happening</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your conveyancer is coordinating with your mortgage lender to ensure your offer is properly submitted
                and integrated into the legal transaction process. This includes verifying all conditions are met and
                coordinating timing with the seller's side.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mortgage offer submission and verification</li>
                <li>• Coordination with lender requirements</li>
                <li>• Legal compliance checks</li>
                <li>• Timeline coordination with all parties</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800">Benefits of This Stage</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Professional handling of your mortgage offer ensures all legal and financial requirements are properly
                coordinated, reducing the risk of delays or complications.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Professional mortgage coordination</li>
                <li>• Legal compliance assurance</li>
                <li>• Risk mitigation and protection</li>
                <li>• Streamlined transaction process</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-800">What You Need to Do</h4>
              <p className="text-sm text-muted-foreground mb-3">
                During this stage, your main responsibility is to remain available for any questions from your
                conveyancer and ensure your mortgage arrangements remain in place.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stay in contact with your conveyancer</li>
                <li>• Maintain your mortgage arrangements</li>
                <li>• Respond promptly to any requests</li>
                <li>• Prepare for the completion stage</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
