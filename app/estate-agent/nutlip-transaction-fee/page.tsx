"use client"

import { useState, useEffect } from "react"
import TransactionLayout from "@/components/transaction-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, AlertTriangle, Calculator, Info, Bell } from "lucide-react"
import { useRealTime } from "@/contexts/real-time-context"

export default function EstateAgentNutlipTransactionFeePage() {
  const { updates } = useRealTime()
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "completed">("processing")
  const [paymentDetails, setPaymentDetails] = useState<{
    bank?: string
    transactionId?: string
    paymentDate?: string
    amount?: number
  }>({})

  // Property details - in real app this would come from transaction data
  const propertyOffer = 300000
  const feePercentage = 0.5
  const calculatedFee = (propertyOffer * feePercentage) / 100
  const vatAmount = calculatedFee * 0.2
  const totalFeeIncVat = calculatedFee + vatAmount

  // Listen for real-time updates about payment completion
  useEffect(() => {
    const paymentUpdate = updates.find(
      (update) =>
        update.stage === "nutlip-transaction-fee" &&
        update.type === "stage_completed" &&
        update.data?.status === "completed",
    )

    if (paymentUpdate) {
      setPaymentStatus("completed")
      setPaymentDetails({
        bank: paymentUpdate.data?.bank as string,
        transactionId: paymentUpdate.data?.transactionId as string,
        paymentDate: paymentUpdate.data?.paymentDate as string,
        amount: paymentUpdate.data?.paymentAmount as number,
      })
    }
  }, [updates])

  return (
    <TransactionLayout title="Nutlip Transaction Fee" stage="nutlip-transaction-fee" userRole="estate-agent">
      <div className="space-y-6">
        {/* Conveyancer Handling Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Transaction Fee Information
            </CardTitle>
            <CardDescription>Important information about the Nutlip platform fee process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Conveyancer Responsibility</h4>
              <p className="text-sm text-blue-700 mb-3">
                This stage of the transaction process is handled entirely by the{" "}
                <strong>buyer and seller conveyancers</strong>. The buyer's conveyancer will process the Nutlip
                transaction fee payment through our secure Open Banking system.
              </p>
              <p className="text-sm text-blue-700">
                {paymentStatus === "completed"
                  ? "The payment has been completed successfully and the transaction can now proceed to the final stages where your involvement will be required again."
                  : "As the estate agent, you will be automatically notified when this stage has been completed and the transaction can proceed to the final stages."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Property & Fee Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Transaction Fee Calculation
            </CardTitle>
            <CardDescription>Nutlip platform fee based on accepted property offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Details */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Property Transaction Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-700 mb-1">Property Address</div>
                  <div className="font-medium">123 Oak Avenue, London SW1A 1AA</div>
                </div>
                <div>
                  <div className="text-sm text-purple-700 mb-1">Accepted Offer</div>
                  <div className="font-bold text-lg">£{propertyOffer.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Fee Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800 mb-1">Fee Rate</div>
                <div className="text-2xl font-bold text-blue-900">{feePercentage}%</div>
                <div className="text-xs text-blue-700">Of accepted offer</div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-1">Base Fee</div>
                <div className="text-2xl font-bold text-green-900">£{calculatedFee.toLocaleString()}</div>
                <div className="text-xs text-green-700">Excl. VAT</div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm text-orange-800 mb-1">VAT (20%)</div>
                <div className="text-2xl font-bold text-orange-900">£{vatAmount.toLocaleString()}</div>
                <div className="text-xs text-orange-700">Added to base fee</div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-800 mb-1">Total Fee</div>
                <div className="text-2xl font-bold text-purple-900">£{totalFeeIncVat.toLocaleString()}</div>
                <div className="text-xs text-purple-700">Inc. VAT</div>
              </div>
            </div>

            {/* Payment Status */}
            <div
              className={`flex items-center justify-between p-4 border rounded-lg ${
                paymentStatus === "completed" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {paymentStatus === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <div className="font-medium">
                    {paymentStatus === "completed" ? "Payment Completed" : "Payment Processing"}
                  </div>
                  <div className="text-sm text-grey-600">
                    {paymentStatus === "completed"
                      ? `Successfully paid via ${paymentDetails.bank || "Open Banking"}`
                      : "Buyer's conveyancer handling payment"}
                  </div>
                </div>
              </div>
              <Badge variant={paymentStatus === "completed" ? "default" : "secondary"}>
                {paymentStatus === "completed" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Completion Details */}
        {paymentStatus === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Payment Completed Successfully
              </CardTitle>
              <CardDescription>The Nutlip transaction fee has been successfully processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Amount</div>
                    <div className="font-bold">£{(paymentDetails.amount || totalFeeIncVat).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Method</div>
                    <div className="font-bold">{paymentDetails.bank || "Open Banking"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Transaction ID</div>
                    <div className="font-bold">{paymentDetails.transactionId || "Processing..."}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-800 mb-1">Payment Date</div>
                    <div className="font-bold">
                      {paymentDetails.paymentDate
                        ? new Date(paymentDetails.paymentDate).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                <p className="text-sm text-blue-700">
                  The transaction fee has been successfully paid and the property transaction can now proceed to the
                  final completion stages where your involvement as the estate agent will be required again.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conveyancer Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Conveyancer Activity</CardTitle>
            <CardDescription>Current progress on transaction fee processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Fee Calculation Confirmed</div>
                    <div className="text-sm text-grey-600">Buyer's conveyancer verified fee amount</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              </div>

              <div
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  paymentStatus === "completed" ? "bg-green-50" : "bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {paymentStatus === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <div className="font-medium">Payment Processing</div>
                    <div className="text-sm text-grey-600">
                      {paymentStatus === "completed"
                        ? "Payment successfully completed"
                        : "Open Banking payment in progress"}
                    </div>
                  </div>
                </div>
                <Badge
                  className={
                    paymentStatus === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {paymentStatus === "completed" ? "Complete" : "In Progress"}
                </Badge>
              </div>

              <div
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  paymentStatus === "completed" ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {paymentStatus === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-grey-500" />
                  )}
                  <div>
                    <div className="font-medium">Payment Confirmation</div>
                    <div className="text-sm text-grey-600">
                      {paymentStatus === "completed" ? "Payment confirmed and recorded" : "Awaiting payment completion"}
                    </div>
                  </div>
                </div>
                <Badge
                  className={paymentStatus === "completed" ? "bg-green-100 text-green-800" : ""}
                  variant={paymentStatus === "completed" ? undefined : "outline"}
                >
                  {paymentStatus === "completed" ? "Complete" : "Pending"}
                </Badge>
              </div>

              <div
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  paymentStatus === "completed" ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {paymentStatus === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-grey-500" />
                  )}
                  <div>
                    <div className="font-medium">Stage Completion</div>
                    <div className="text-sm text-grey-600">
                      {paymentStatus === "completed"
                        ? "Transaction ready to proceed to final stages"
                        : "Transaction ready to proceed"}
                    </div>
                  </div>
                </div>
                <Badge
                  className={paymentStatus === "completed" ? "bg-green-100 text-green-800" : ""}
                  variant={paymentStatus === "completed" ? undefined : "outline"}
                >
                  {paymentStatus === "completed" ? "Complete" : "Pending"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
            <CardDescription>Detailed breakdown of the Nutlip transaction services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Digital Transaction Management</div>
                    <div className="text-sm text-grey-600">End-to-end transaction coordination platform</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.6).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Document Management System</div>
                    <div className="text-sm text-grey-600">Secure document storage and sharing</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.2).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Communication & Notifications</div>
                    <div className="text-sm text-grey-600">Multi-party messaging and real-time updates</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.15).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Compliance & Support</div>
                    <div className="text-sm text-grey-600">Regulatory compliance and customer support</div>
                  </div>
                  <span className="font-bold">£{(calculatedFee * 0.05).toLocaleString()}</span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div>
                    <div className="font-bold">Total Fee (Inc. VAT)</div>
                    <div className="text-sm text-grey-600">Paid by buyer's conveyancer</div>
                  </div>
                  <span className="text-xl font-bold text-purple-900">£{totalFeeIncVat.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Services Provided
            </CardTitle>
            <CardDescription>What the Nutlip platform fee covers for this transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Digital transaction management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Real-time progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Secure document sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Automated notifications</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Multi-party coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Deadline management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">24/7 platform access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Customer support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              {paymentStatus === "completed"
                ? "You have been notified that this stage is now completed"
                : "You will be automatically notified when this stage is completed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  paymentStatus === "completed" ? "bg-green-50 border-green-200" : "bg-blue-50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${paymentStatus === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                ></div>
                <div>
                  <div className="font-medium text-sm">Payment Completion Alert</div>
                  <div className="text-sm text-grey-600">
                    {paymentStatus === "completed"
                      ? "✓ Notification sent - Fee payment completed successfully"
                      : "Immediate notification when fee payment is completed"}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  paymentStatus === "completed" ? "bg-green-50 border-green-200" : "bg-green-50"
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Stage Progression</div>
                  <div className="text-sm text-grey-600">
                    {paymentStatus === "completed"
                      ? "✓ Ready to progress to final completion stages"
                      : "Automatic progression to next transaction stage"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-purple-50">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Real-Time Updates</div>
                  <div className="text-sm text-grey-600">Live status updates on your dashboard</div>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg ${
                paymentStatus === "completed" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              <h4 className={`font-medium mb-2 ${paymentStatus === "completed" ? "text-green-800" : "text-amber-800"}`}>
                {paymentStatus === "completed" ? "Stage Completed" : "Next Steps"}
              </h4>
              <p className={`text-sm ${paymentStatus === "completed" ? "text-green-700" : "text-amber-700"}`}>
                {paymentStatus === "completed"
                  ? "The buyer's conveyancer has completed the fee payment and the transaction will automatically progress to the final completion stages where your involvement will be required again."
                  : "Once the buyer's conveyancer completes the fee payment, you will be notified and the transaction will automatically progress to the final completion stages where your involvement will be required again."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-amber-800">Fee Structure</p>
                <p className="text-amber-700">
                  The Nutlip transaction fee is calculated at 0.5% of the accepted property offer (£
                  {propertyOffer.toLocaleString()}), plus VAT.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Conveyancer Responsibility</p>
                <p className="text-blue-700">
                  This stage is handled entirely by the buyer and seller conveyancers. The buyer's conveyancer processes
                  the payment through secure Open Banking.
                </p>
              </div>

              <div
                className={`p-3 border rounded-lg ${
                  paymentStatus === "completed" ? "bg-green-50 border-green-200" : "bg-green-50 border-green-200"
                }`}
              >
                <p className="font-medium text-green-800">Estate Agent Role</p>
                <p className="text-green-700">
                  {paymentStatus === "completed"
                    ? "The payment has been completed successfully. You will be notified when your involvement is required for the final completion stages."
                    : "You will be automatically notified when this stage is completed and your involvement is required for the final completion stages."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TransactionLayout>
  )
}
